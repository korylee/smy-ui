const markdown = require('markdown-it')

const lowerFirst = (word) => word.charAt(0).toLowerCase() + word.slice(1)

const gnDocField = (component) => `${lowerFirst(component)}Doc`

function htmlWrapper(html) {
  const matches = html.matchAll(/<h3>(.*?)<\/h3>/g)

  const hGroup = html
    .replace(/<h3>/g, () => {
      const content = matches.next().value[1]

      return `:::<h3 id="${content}"><router-link to="#${content}">#</router-link>`
    })
    .replace(/<h2/g, ':::<h2')
    .split(':::')

  const cardGroup = hGroup
    .map((fragment) => (fragment.includes('<h3') ? `<div class="doc-card">${fragment}</div>` : fragment))
    .join('')
  return cardGroup.replace(/<code>/g, '<code v-pre>')
}

const codeRE = /<pre class="hljs">(([\s\S])*?)<\/pre>/g

const mdReg = /\.md$/

function createHighlight(componentMap) {
  return function highlight(str, lang, attr) {
    if (lang === 'demo') {
      const componentRE = /import (.+) from ['"](.+)['"]/
      const importRE = /import .+ from ['"].+['"]/g
      const partImports = str.match(importRE)
      const components = []
      partImports?.forEach((importer) => {
        importer = importer.replace(/(\n|\r)/g, '')
        const component = importer.replace(componentRE, '$1')
        const componentPath = importer.replace(componentRE, '$2')
        if (!components.includes(component)) {
          components.push(component)
          componentMap.set(component, componentPath)
        }
      })
      let replaced = ''
      components.forEach((component) => {
        const componentRaw = gnDocField(component)
        replaced += `<smy-site-code-example ${attr} uri lang="vue" :code="encodeURIComponent(${componentRaw})" />`
      })
      return replaced && `<pre class="hljs">${replaced}</pre>`
    }
    if (lang) {
      attr = !attr.includes('playground-ignore') && lang !== 'vue' ? 'playground-ignore' : attr
      return `\
<pre class="hljs">
  <smy-site-code-example ${attr} uri lang="${lang}" code="${encodeURIComponent(str)}" />
</pre>`
    }
    return ''
  }
}

function markdownToVue(source) {
  const componentMap = new Map()
  const md = markdown({
    html: true,
    typographer: true,
    highlight: createHighlight(componentMap),
  })

  let templateString = htmlWrapper(md.render(source))
  let importString = ''
  let componentString = ''
  let dataString = ''
  componentMap.forEach((path, component) => {
    const componentRaw = gnDocField(component)
    importString += `import ${component} from '${path}'
    import ${componentRaw} from '${path}?raw'\n`
    componentString += `${component},\n`
    dataString += `${componentRaw},\n`
  })
  templateString = templateString
    .replace(/process.env/g, '<span>process.env</span>')
    .replace(/require/g, '<span>require</span>')
    .replace(codeRE, (_, str) => str)

  return `\
  <template><div class="smy-site-doc">${templateString}</div></template>
  <script>
  ${importString}

  export default {
    data: () => ({
      ${dataString}
    }),
    components: {
      ${componentString}
    }
  }
  </script>
  `
}

function MardownVitePlugin() {
  return {
    name: 'markdown-vite-plugin',
    enforce: 'pre',
    transform(source, id) {
      if (!mdReg.test(id)) return
      try {
        return markdownToVue(source)
      } catch (e) {
        this.error(e)
        return ''
      }
    },
    async handleHotUpdate(ctx) {
      if (!mdReg.test(ctx.file)) return
      const readSource = ctx.read
      ctx.read = async function () {
        return markdownToVue(await readSource())
      }
    },
  }
}

module.exports = MardownVitePlugin
