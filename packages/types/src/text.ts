import type { Base } from './document'

export enum TextType {
  Bold = 'bold',
  Italic = 'italic',
  InlineCode = 'inline_code',
  Link = 'link',
  Image = 'image',
  Math = 'math',
  Subscript = 'subscript',
  Superscript = 'superscript',
  Highlight = 'highlight',
  Strikethrough = 'strikethrough',
  Normal = 'normal',
  Underline = 'underline',
}

export interface Text extends Base {
  raw: string
  type: TextType[]
  content: string
}

export interface CodeText extends Text {
  lineNumber: number
}

export interface ListChild {
  text: Text[]
  level: number
}
