import { declare } from '@babel/helper-plugin-utils'
import { readFileSync } from 'fs'

module.exports = declare(()=>({
  overrides: [
    {
      test: (file:string)=>{
        if(/\.vue$/.test(file)){
          const code = readFileSync(file, 'utf8')
          return code.includes(`lang="ts"`) || code.includes(`lang='ts'`)
        }
        return false
      },
      plugins: ['@babel/plugin-transform-typescript']
    }
  ]
}))