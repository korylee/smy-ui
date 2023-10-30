import { getRect, createDomRect } from '../_utils/dom'
import { IN_BROWSER } from '../_utils/env'
import { isFunction } from '../_utils/is'
import { removeItem, throttle } from '../_utils/shared'

const SUPPORT_INTERSECTION =
  'IntersectionObserver' in window &&
  'IntersectionObserverEntry' in window &&
  'intersectionRatio' in window.IntersectionObserverEntry.prototype

/**
 * copy from https://github.com/GoogleChromeLabs/intersection-observer
 */

/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the W3C SOFTWARE AND DOCUMENT NOTICE AND LICENSE.
 *
 *  https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 */
;(function () {
  // Exit early if we're not running in a browser.
  if (!IN_BROWSER) {
    return
  }

  // Exit early if all IntersectionObserver and IntersectionObserverEntry
  // features are natively supported.
  if (SUPPORT_INTERSECTION) {
    const entryProtoType = window.IntersectionObserverEntry.prototype
    // Minimal polyfill for Edge 15's lack of `isIntersecting`
    // See: https://github.com/w3c/IntersectionObserver/issues/211
    if (!('isIntersecting' in entryProtoType)) {
      Object.defineProperty(entryProtoType, 'isIntersecting', {
        get: function () {
          return this.intersectionRatio > 0
        },
      })
    }
    return
  }

  /**
   * Returns the embedding frame element, if any.
   * @param {!Document} doc
   * @return {!Element}
   */
  function getFrameElement(doc) {
    try {
      return doc.defaultView?.frameElement
    } catch (e) {
      // Ignore the error.
      return null
    }
  }

  /**
   * A local reference to the root document.
   */
  const document = (function (startDoc) {
    let doc = startDoc
    let frame = getFrameElement(doc)
    while (frame) {
      doc = frame.ownerDocument
      frame = getFrameElement(doc)
    }
    return doc
  })(window.document)

  /**
   * An IntersectionObserver registry. This registry exists to hold a strong
   * reference to IntersectionObserver instances currently observing a target
   * element. Without this registry, instances without another reference may be
   * garbage collected.
   */
  const registry = []

  /**
   * The signal updater for cross-origin intersection. When not null, it means
   * that the polyfill is configured to work in a cross-origin mode.
   * @type {function(DOMRect|ClientRect, DOMRect|ClientRect)}
   */
  let crossOriginUpdater = null

  /**
   * The current cross-origin intersection. Only used in the cross-origin mode.
   * @type {DOMRect|ClientRect}
   */
  let crossOriginRect = null

  /**
   * Creates the global IntersectionObserverEntry constructor.
   * https://w3c.github.io/IntersectionObserver/#intersection-observer-entry
   * @param {Object} entry A dictionary of instance properties.
   * @constructor
   */
  function IntersectionObserverEntry(entry) {
    this.time = entry.time
    this.target = entry.target
    this.rootBounds = ensureDOMRect(entry.rootBounds)
    this.boundingClientRect = ensureDOMRect(entry.boundingClientRect)
    this.intersectionRect = ensureDOMRect(entry.intersectionRect || createDomRect())
    this.isIntersecting = !!entry.intersectionRect

    // Calculates the intersection ratio.
    const targetRect = this.boundingClientRect
    const targetArea = targetRect.width * targetRect.height
    const intersectionRect = this.intersectionRect
    const intersectionArea = intersectionRect.width * intersectionRect.height

    // Sets intersection ratio.
    if (targetArea) {
      // Round the intersection ratio to avoid floating point math issues:
      // https://github.com/w3c/IntersectionObserver/issues/324
      this.intersectionRatio = Number((intersectionArea / targetArea).toFixed(4))
    } else {
      // If area is zero and is intersecting, sets to 1, otherwise to 0
      this.intersectionRatio = this.isIntersecting ? 1 : 0
    }
  }

  /**
   * Creates the global IntersectionObserver constructor.
   * https://w3c.github.io/IntersectionObserver/#intersection-observer-interface
   * @param {Function} callback The function to be invoked after intersection
   *     changes have queued. The function is not invoked if the queue has
   *     been emptied by calling the `takeRecords` method.
   * @param {Object=} options Optional configuration options.
   * @constructor
   */
  function IntersectionObserver(callback, options = {}) {
    const { root, rootMargin } = options
    if (!isFunction(callback)) {
      throw new Error('callback must be a function')
    }

    if (root && ![1, 9].includes(root?.nodeType)) {
      throw new Error('root must be a Document or Element')
    }

    // Binds and throttles `this._checkForIntersections`.
    this._checkForIntersections = throttle(this._checkForIntersections.bind(this), this.THROTTLE_TIMEOUT)

    // Private properties.
    this._callback = callback
    this._observationTargets = []
    this._queuedEntries = []
    this._rootMarginValues = this._parseRootMargin(rootMargin)

    // Public properties.
    this.thresholds = this._initThresholds(options.threshold)
    this.root = root || null
    this.rootMargin = this._rootMarginValues
      .map(function (margin) {
        return margin.value + margin.unit
      })
      .join(' ')

    /** @private @const {!Array<!Document>} */
    this._monitoringDocuments = []
    /** @private @const {!Array<function()>} */
    this._monitoringUnsubscribes = []
  }

  const IOPrototype = IntersectionObserver.prototype
  /**
   * The minimum interval within which the document will be checked for
   * intersection changes.
   */
  IOPrototype.THROTTLE_TIMEOUT = 150

  /**
   * The frequency in which the polyfill polls for intersection changes.
   * this can be updated on a per instance basis and must be set prior to
   * calling `observe` on the first target.
   */
  IOPrototype.POLL_INTERVAL = null

  /**
   * Use a mutation observer on the root element
   * to detect intersection changes.
   */
  IOPrototype.USE_MUTATION_OBSERVER = true

  /**
   * Sets up the polyfill in the cross-origin mode. The result is the
   * updater function that accepts two arguments: `boundingClientRect` and
   * `intersectionRect` - just as these fields would be available to the
   * parent via `IntersectionObserverEntry`. This function should be called
   * each time the iframe receives intersection information from the parent
   * window, e.g. via messaging.
   * @return {function(DOMRect|ClientRect, DOMRect|ClientRect)}
   */
  IntersectionObserver._setupCrossOriginUpdater = function () {
    if (!crossOriginUpdater) {
      /**
       * @param {DOMRect|ClientRect} boundingClientRect
       * @param {DOMRect|ClientRect} intersectionRect
       */
      crossOriginUpdater = function (boundingClientRect, intersectionRect) {
        if (!boundingClientRect || !intersectionRect) {
          crossOriginRect = createDomRect()
        } else {
          crossOriginRect = convertFromParentRect(boundingClientRect, intersectionRect)
        }
        registry.forEach(function (observer) {
          observer._checkForIntersections()
        })
      }
    }
    return crossOriginUpdater
  }

  /**
   * Resets the cross-origin mode.
   */
  IntersectionObserver._resetCrossOriginUpdater = function () {
    crossOriginUpdater = null
    crossOriginRect = null
  }

  /**
   * Starts observing a target element for intersection changes based on
   * the thresholds values.
   * @param {Element} target The DOM element to observe.
   */
  IOPrototype.observe = function (target) {
    const isTargetAlreadyObserved = this._observationTargets.some(function (item) {
      return item.element == target
    })

    if (isTargetAlreadyObserved) {
      return
    }

    if (!(target && target.nodeType == 1)) {
      throw new Error('target must be an Element')
    }

    this._registerInstance()
    this._observationTargets.push({ element: target, entry: null })
    this._monitorIntersections(target.ownerDocument)
    this._checkForIntersections()
  }

  /**
   * Stops observing a target element for intersection changes.
   * @param {Element} target The DOM element to observe.
   */
  IOPrototype.unobserve = function (target) {
    this._observationTargets = this._observationTargets.filter(function (item) {
      return item.element != target
    })
    this._unmonitorIntersections(target.ownerDocument)
    if (this._observationTargets.length == 0) {
      this._unregisterInstance()
    }
  }

  /**
   * Stops observing all target elements for intersection changes.
   */
  IOPrototype.disconnect = function () {
    this._observationTargets = []
    this._unmonitorAllIntersections()
    this._unregisterInstance()
  }

  /**
   * Returns any queue entries that have not yet been reported to the
   * callback and clears the queue. This can be used in conjunction with the
   * callback to obtain the absolute most up-to-date intersection information.
   * @return {Array} The currently queued entries.
   */
  IOPrototype.takeRecords = function () {
    const records = this._queuedEntries.slice()
    this._queuedEntries = []
    return records
  }

  /**
   * Accepts the threshold value from the user configuration object and
   * returns a sorted array of unique threshold values. If a value is not
   * between 0 and 1 and error is thrown.
   * @private
   * @param {Array|number=} opt_threshold An optional threshold value or
   *     a list of threshold values, defaulting to [0].
   * @return {Array} A sorted list of unique and valid threshold values.
   */
  IOPrototype._initThresholds = function (opt_threshold) {
    let threshold = opt_threshold || [0]
    if (!Array.isArray(threshold)) threshold = [threshold]

    return threshold.sort().filter(function (t, i, a) {
      if (typeof t != 'number' || isNaN(t) || t < 0 || t > 1) {
        throw new Error('threshold must be a number between 0 and 1 inclusively')
      }
      return t !== a[i - 1]
    })
  }

  /**
   * Accepts the rootMargin value from the user configuration object
   * and returns an array of the four margin values as an object containing
   * the value and unit properties. If any of the values are not properly
   * formatted or use a unit other than px or %, and error is thrown.
   * @private
   * @param {string=} opt_rootMargin An optional rootMargin value,
   *     defaulting to '0px'.
   * @return {Array<Object>} An array of margin objects with the keys
   *     value and unit.
   */
  IOPrototype._parseRootMargin = function (opt_rootMargin) {
    const marginString = opt_rootMargin || '0px'
    const margins = marginString.split(/\s+/).map(function (margin) {
      const parts = /^(-?\d*\.?\d+)(px|%)$/.exec(margin)
      if (!parts) {
        throw new Error('rootMargin must be specified in pixels or percent')
      }
      return { value: parseFloat(parts[1]), unit: parts[2] }
    })

    // Handles shorthand.
    margins[1] = margins[1] || margins[0]
    margins[2] = margins[2] || margins[0]
    margins[3] = margins[3] || margins[1]

    return margins
  }

  /**
   * Starts polling for intersection changes if the polling is not already
   * happening, and if the page's visibility state is visible.
   * @param {!Document} doc
   * @private
   */
  IOPrototype._monitorIntersections = function (doc) {
    const win = doc.defaultView
    if (!win) {
      // Already destroyed.
      return
    }
    if (this._monitoringDocuments.indexOf(doc) != -1) {
      // Already monitoring.
      return
    }

    // Private state for monitoring.
    const callback = this._checkForIntersections
    let monitoringInterval = null
    let domObserver = null

    // If a poll interval is set, use polling instead of listening to
    // resize and scroll events or DOM mutations.
    if (this.POLL_INTERVAL) {
      monitoringInterval = win.setInterval(callback, this.POLL_INTERVAL)
    } else {
      win.addEventListener('resize', callback, true)
      doc.addEventListener('scroll', callback, true)

      if (this.USE_MUTATION_OBSERVER && 'MutationObserver' in win) {
        domObserver = new win.MutationObserver(callback)
        domObserver.observe(doc, {
          attributes: true,
          childList: true,
          characterData: true,
          subtree: true,
        })
      }
    }

    this._monitoringDocuments.push(doc)
    this._monitoringUnsubscribes.push(function () {
      // Get the window object again. When a friendly iframe is destroyed, it
      // will be null.
      const win = doc.defaultView

      if (win) {
        if (monitoringInterval) {
          win.clearInterval(monitoringInterval)
        }
        win.removeEventListener('resize', callback, true)
      }
      doc.removeEventListener('scroll', callback, true)
      if (domObserver) {
        domObserver.disconnect()
      }
    })

    // Also monitor the parent.
    const rootDoc = (this.root && (this.root.ownerDocument || this.root)) || document
    if (doc != rootDoc) {
      const frame = getFrameElement(doc)
      if (frame) {
        this._monitorIntersections(frame.ownerDocument)
      }
    }
  }

  /**
   * Stops polling for intersection changes.
   * @param {!Document} doc
   * @private
   */
  IOPrototype._unmonitorIntersections = function (doc) {
    const index = this._monitoringDocuments.indexOf(doc)
    if (index == -1) {
      return
    }

    const rootDoc = (this.root && (this.root.ownerDocument || this.root)) || document

    // Check if any dependent targets are still remaining.
    const hasDependentTargets = this._observationTargets.some(function (item) {
      let itemDoc = item.element.ownerDocument
      // Target is in this context.
      if (itemDoc == doc) {
        return true
      }
      // Target is nested in this context.
      while (itemDoc && itemDoc != rootDoc) {
        const frame = getFrameElement(itemDoc)
        itemDoc = frame && frame.ownerDocument
        if (itemDoc == doc) {
          return true
        }
      }
      return false
    })
    if (hasDependentTargets) {
      return
    }

    // Unsubscribe.
    const unsubscribe = this._monitoringUnsubscribes[index]
    this._monitoringDocuments.splice(index, 1)
    this._monitoringUnsubscribes.splice(index, 1)
    unsubscribe()

    // Also unmonitor the parent.
    if (doc != rootDoc) {
      const frame = getFrameElement(doc)
      if (frame) {
        this._unmonitorIntersections(frame.ownerDocument)
      }
    }
  }

  /**
   * Stops polling for intersection changes.
   * @param {!Document} doc
   * @private
   */
  IOPrototype._unmonitorAllIntersections = function () {
    const unsubscribes = this._monitoringUnsubscribes.slice(0)
    this._monitoringDocuments.length = 0
    this._monitoringUnsubscribes.length = 0
    for (let i = 0; i < unsubscribes.length; i++) {
      unsubscribes[i]()
    }
  }

  /**
   * Scans each observation target for intersection changes and adds them
   * to the internal entries queue. If new entries are found, it
   * schedules the callback to be invoked.
   * @private
   */
  IOPrototype._checkForIntersections = function () {
    if (!this.root && crossOriginUpdater && !crossOriginRect) {
      // Cross origin monitoring, but no initial data available yet.
      return
    }

    const rootIsInDom = this._rootIsInDom()
    const rootRect = rootIsInDom ? this._getRootRect() : createDomRect()

    this._observationTargets.forEach(function (item) {
      const target = item.element
      const targetRect = getRect(target)
      const rootContainsTarget = this._rootContainsTarget(target)
      const oldEntry = item.entry
      const intersectionRect =
        rootIsInDom && rootContainsTarget && this._computeTargetAndRootIntersection(target, targetRect, rootRect)

      let rootBounds = null
      if (!this._rootContainsTarget(target)) {
        rootBounds = createDomRect()
      } else if (!crossOriginUpdater || this.root) {
        rootBounds = rootRect
      }

      const newEntry = (item.entry = new IntersectionObserverEntry({
        time: now(),
        target: target,
        boundingClientRect: targetRect,
        rootBounds: rootBounds,
        intersectionRect: intersectionRect,
      }))

      if (!oldEntry) {
        this._queuedEntries.push(newEntry)
      } else if (rootIsInDom && rootContainsTarget) {
        // If the new entry intersection ratio has crossed any of the
        // thresholds, add a new entry.
        if (this._hasCrossedThreshold(oldEntry, newEntry)) {
          this._queuedEntries.push(newEntry)
        }
      } else {
        // If the root is not in the DOM or target is not contained within
        // root but the previous entry for this target had an intersection,
        // add a new record indicating removal.
        if (oldEntry && oldEntry.isIntersecting) {
          this._queuedEntries.push(newEntry)
        }
      }
    }, this)

    if (this._queuedEntries.length) {
      this._callback(this.takeRecords(), this)
    }
  }

  /**
   * Accepts a target and root rect computes the intersection between then
   * following the algorithm in the spec.
   * TODO(philipwalton): at this time clip-path is not considered.
   * https://w3c.github.io/IntersectionObserver/#calculate-intersection-rect-algo
   * @param {Element} target The target DOM element
   * @param {Object} targetRect The bounding rect of the target.
   * @param {Object} rootRect The bounding rect of the root after being
   *     expanded by the rootMargin value.
   * @return {?Object} The final intersection rect object or undefined if no
   *     intersection is found.
   * @private
   */
  IOPrototype._computeTargetAndRootIntersection = function (target, targetRect, rootRect) {
    // If the element isn't displayed, an intersection can't happen.
    if (window.getComputedStyle(target).display == 'none') return

    let intersectionRect = targetRect
    let parent = getParentNode(target)
    let atRoot = false

    while (!atRoot && parent) {
      let parentRect = null
      const parentComputedStyle = parent.nodeType == 1 ? window.getComputedStyle(parent) : {}

      // If the parent isn't displayed, an intersection can't happen.
      if (parentComputedStyle.display == 'none') return null

      if (parent == this.root || parent.nodeType == /* DOCUMENT */ 9) {
        atRoot = true
        if (parent == this.root || parent == document) {
          if (crossOriginUpdater && !this.root) {
            if (!crossOriginRect || (crossOriginRect.width == 0 && crossOriginRect.height == 0)) {
              // A 0-size cross-origin intersection means no-intersection.
              parent = null
              parentRect = null
              intersectionRect = null
            } else {
              parentRect = crossOriginRect
            }
          } else {
            parentRect = rootRect
          }
        } else {
          // Check if there's a frame that can be navigated to.
          const frame = getParentNode(parent)
          const frameRect = frame && getRect(frame)
          const frameIntersect = frame && this._computeTargetAndRootIntersection(frame, frameRect, rootRect)
          if (frameRect && frameIntersect) {
            parent = frame
            parentRect = convertFromParentRect(frameRect, frameIntersect)
          } else {
            parent = null
            intersectionRect = null
          }
        }
      } else {
        // If the element has a non-visible overflow, and it's not the <body>
        // or <html> element, update the intersection rect.
        // Note: <body> and <html> cannot be clipped to a rect that's not also
        // the document rect, so no need to compute a new intersection.
        const doc = parent.ownerDocument
        if (parent != doc.body && parent != doc.documentElement && parentComputedStyle.overflow != 'visible') {
          parentRect = getRect(parent)
        }
      }

      // If either of the above conditionals set a new parentRect,
      // calculate new intersection data.
      if (parentRect) {
        intersectionRect = computeRectIntersection(parentRect, intersectionRect)
      }
      if (!intersectionRect) break
      parent = parent && getParentNode(parent)
    }
    return intersectionRect
  }

  /**
   * Returns the root rect after being expanded by the rootMargin value.
   * @return {ClientRect} The expanded root rect.
   * @private
   */
  IOPrototype._getRootRect = function () {
    let rootRect
    if (this.root && !isDoc(this.root)) {
      rootRect = getRect(this.root)
    } else {
      // Use <html>/<body> instead of window since scroll bars affect size.
      const doc = isDoc(this.root) ? this.root : document
      const html = doc.documentElement
      const body = doc.body
      const { clientWidth: htmlWidth, clientHeight: htmlHeight } = html
      const { clientWidth: bodyWidth, clientHeight: bodyHeight } = body
      rootRect = {
        top: 0,
        left: 0,
        right: htmlWidth || bodyWidth,
        width: htmlWidth || bodyWidth,
        bottom: htmlHeight || bodyHeight,
        height: htmlHeight || bodyHeight,
      }
    }
    return this._expandRectByRootMargin(rootRect)
  }

  /**
   * Accepts a rect and expands it by the rootMargin value.
   * @param {DOMRect|ClientRect} rect The rect object to expand.
   * @return {ClientRect} The expanded rect.
   * @private
   */
  IOPrototype._expandRectByRootMargin = function (rect) {
    const margins = this._rootMarginValues.map(function (margin, i) {
      return margin.unit == 'px' ? margin.value : (margin.value * (i % 2 ? rect.width : rect.height)) / 100
    })
    const newRect = {
      top: rect.top - margins[0],
      right: rect.right + margins[1],
      bottom: rect.bottom + margins[2],
      left: rect.left - margins[3],
    }
    newRect.width = newRect.right - newRect.left
    newRect.height = newRect.bottom - newRect.top

    return newRect
  }

  /**
   * Accepts an old and new entry and returns true if at least one of the
   * threshold values has been crossed.
   * @param {?IntersectionObserverEntry} oldEntry The previous entry for a
   *    particular target element or null if no previous entry exists.
   * @param {IntersectionObserverEntry} newEntry The current entry for a
   *    particular target element.
   * @return {boolean} Returns true if a any threshold has been crossed.
   * @private
   */
  IOPrototype._hasCrossedThreshold = function (oldEntry, newEntry) {
    // To make comparing easier, an entry that has a ratio of 0
    // but does not actually intersect is given a value of -1
    const oldRatio = oldEntry?.isIntersecting ? oldEntry.intersectionRatio || 0 : -1
    const newRatio = newEntry.isIntersecting ? newEntry.intersectionRatio || 0 : -1

    // Ignore unchanged ratios
    if (oldRatio === newRatio) return

    for (let i = 0; i < this.thresholds.length; i++) {
      const threshold = this.thresholds[i]

      // Return true if an entry matches a threshold or if the new ratio
      // and the old ratio are on the opposite sides of a threshold.
      if (threshold == oldRatio || threshold == newRatio || threshold < oldRatio !== threshold < newRatio) {
        return true
      }
    }
  }

  /**
   * Returns whether or not the root element is an element and is in the DOM.
   * @return {boolean} True if the root element is an element and is in the DOM.
   * @private
   */
  IOPrototype._rootIsInDom = function () {
    return !this.root || containsDeep(document, this.root)
  }

  /**
   * Returns whether or not the target element is a child of root.
   * @param {Element} target The target element to check.
   * @return {boolean} True if the target element is a child of root.
   * @private
   */
  IOPrototype._rootContainsTarget = function (target) {
    const rootDoc = (this.root && (this.root.ownerDocument || this.root)) || document
    return containsDeep(rootDoc, target) && (!this.root || rootDoc == target.ownerDocument)
  }

  /**
   * Adds the instance to the global IntersectionObserver registry if it isn't
   * already present.
   * @private
   */
  IOPrototype._registerInstance = function () {
    if (registry.indexOf(this) < 0) {
      registry.push(this)
    }
  }

  /**
   * Removes the instance from the global IntersectionObserver registry.
   * @private
   */
  IOPrototype._unregisterInstance = function () {
    removeItem(registry, this)
  }

  /**
   * Returns the result of the performance.now() method or null in browsers
   * that don't support the API.
   * @return {number} The elapsed time since the page was requested.
   */
  function now() {
    return window.performance?.now?.()
  }

  /**
   * Returns the intersection between two rect objects.
   * @param {Object} rect1 The first rect.
   * @param {Object} rect2 The second rect.
   * @return {?Object|?ClientRect} The intersection rect or undefined if no
   *     intersection is found.
   */
  function computeRectIntersection(rect1, rect2) {
    const top = Math.max(rect1.top, rect2.top)
    const bottom = Math.min(rect1.bottom, rect2.bottom)
    const left = Math.max(rect1.left, rect2.left)
    const right = Math.min(rect1.right, rect2.right)
    const width = right - left
    const height = bottom - top

    return (
      (width >= 0 &&
        height >= 0 && {
          top: top,
          bottom: bottom,
          left: left,
          right: right,
          width: width,
          height: height,
        }) ||
      null
    )
  }

  /**
   * Ensure that the result has all of the necessary fields of the DOMRect.
   * Specifically this ensures that `x` and `y` fields are set.
   *
   * @param {?DOMRect|?ClientRect} rect
   * @return {?DOMRect}
   */
  function ensureDOMRect(rect) {
    // A `DOMRect` object has `x` and `y` fields.
    if (!rect || 'x' in rect) {
      return rect
    }
    // A IE's `ClientRect` type does not have `x` and `y`. The same is the case
    // for internally calculated Rect objects. For the purposes of
    // `IntersectionObserver`, it's sufficient to simply mirror `left` and `top`
    // for these fields.
    return {
      top: rect.top,
      y: rect.top,
      bottom: rect.bottom,
      left: rect.left,
      x: rect.left,
      right: rect.right,
      width: rect.width,
      height: rect.height,
    }
  }

  /**
   * Inverts the intersection and bounding rect from the parent (frame) BCR to
   * the local BCR space.
   * @param {DOMRect|ClientRect} parentBoundingRect The parent's bound client rect.
   * @param {DOMRect|ClientRect} parentIntersectionRect The parent's own intersection rect.
   * @return {ClientRect} The local root bounding rect for the parent's children.
   */
  function convertFromParentRect(parentBoundingRect, parentIntersectionRect) {
    const top = parentIntersectionRect.top - parentBoundingRect.top
    const left = parentIntersectionRect.left - parentBoundingRect.left
    return {
      top: top,
      left: left,
      height: parentIntersectionRect.height,
      width: parentIntersectionRect.width,
      bottom: top + parentIntersectionRect.height,
      right: left + parentIntersectionRect.width,
    }
  }

  /**
   * Checks to see if a parent element contains a child element (including inside
   * shadow DOM).
   * @param {Node} parent The parent element.
   * @param {Node} child The child element.
   * @return {boolean} True if the parent node contains the child node.
   */
  function containsDeep(parent, child) {
    let node = child
    while (node) {
      if (node == parent) return true

      node = getParentNode(node)
    }
    return false
  }

  /**
   * Gets the parent node of an element or its host element if the parent node
   * is a shadow root.
   * @param {Node} node The node whose parent to get.
   * @return {Node|null} The parent node or null if no parent exists.
   */
  function getParentNode(node) {
    let parent = node.parentNode

    if (node.nodeType == /* DOCUMENT */ 9 && node != document) {
      // If this node is a document node, look for the embedding frame.
      return getFrameElement(node)
    }

    // If the parent has element that is assigned through shadow root slot
    if (parent && parent.assignedSlot) {
      parent = parent.assignedSlot.parentNode
    }

    if (parent && parent.nodeType == 11 && parent.host) {
      // If the parent is a shadow root, return the host element.
      return parent.host
    }

    return parent
  }

  /**
   * Returns true if `node` is a Document.
   * @param {!Node} node
   * @returns {boolean}
   */
  function isDoc(node) {
    return node && node.nodeType === 9
  }

  // Exposes the constructors globally.
  window.IntersectionObserver = IntersectionObserver
  window.IntersectionObserverEntry = IntersectionObserverEntry
})()
