import { markdown } from '@codemirror/lang-markdown'
import { EditorView, minimalSetup, basicSetup } from 'codemirror'
import { LitElement, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('bytemd-codemirror')
export class Codemirror extends LitElement {
  @property() value: string = ''
  @property() editor: EditorView | null = null

  firstUpdated() {
    const updateListener = EditorView.updateListener.of((vu) => {
      // console.log(vu)
      if (vu.docChanged) {
        this.dispatchEvent(
          new CustomEvent('change', { detail: vu.state.doc.toString() }),
        )
      }
    })

    const theme = EditorView.theme({
      '& .cm-scroller': {
        fontFamily: 'SF Mono, Consolas, Liberation Mono, Menlo, monospace',
        fontSize: '14px',
      },
    })

    this.editor = new EditorView({
      doc: this.value,
      extensions: [
        EditorView.lineWrapping,
        basicSetup,
        theme,
        markdown({
          extensions: [],
        }),
        updateListener,
      ],
      parent: this.renderRoot,
    })

    this.dispatchEvent(new CustomEvent('context', { detail: this.editor }))
  }

  static styles = css`
    .cm-editor {
      height: 100%;
    }
  `
}
