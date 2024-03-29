import type Token from 'markdown-it/lib/token'
import YAML from 'js-yaml'
import { isObject } from '@antfu/utils'

export interface SliceResult {
  tokens: Token[]
  offset: number
}

export function sliceSection(tokens: Token[]): SliceResult {
  let offset = 1
  while (offset < tokens.length) {
    if (tokens[offset].tag === 'h1' && tokens[offset].nesting === 1)
      break
    offset++
  }
  return {
    tokens: tokens.slice(0, offset),
    offset,
  }
}

export function sliceParagraph(tokens: Token[]): SliceResult {
  let offset = 0
  if (tokens[0].tag !== 'code') {
    // Normal paragraphs.
    while (offset < tokens.length) {
      if (tokens[offset].nesting === -1 && tokens[offset].level === 0)
        break
      offset++
    }
  }
  // Return paragraph tokens.
  return {
    tokens: tokens.slice(0, offset + 1),
    offset: offset + 1,
  }
}

export function sliceTableRow(tokens: Token[]): SliceResult {
  let offset = 1
  while (offset < tokens.length) {
    if (tokens[offset].type === 'tr_open')
      break
    offset++
  }
  return {
    tokens: tokens.slice(0, offset),
    offset,
  }
}

export function sliceInlineText(tokens: Token[]): SliceResult {
  if (tokens[0].tag === 'img' || tokens[0].tag === 'code') {
    return {
      tokens: tokens.slice(0, 1),
      offset: 1,
    }
  }
  return sliceParagraph(tokens)
}

export const MATH_BLOCK_REGEXP = /^\$\$\n([^]*)\n\$\$$/

export const COMMENT_REGEXP = /^\<\!\-[^]*\-\>$/

export const matter = (code: string) => {
  let data: any = {}
  const content = code.replace(/^---.*\r?\n([\s\S]*?)---/,
    (_, d) => {
      data = YAML.load(d)
      if (!isObject(data))
        data = {}
      return ''
    })
  return { data, content }
}

export const HEADING_REGEXP = /^(#+) (.*)$/m

export const isTableWithTitle = (line: string, next: string) => line.match(/\[\[([\s\S]*)\]\]/m) && next.match(/^\|[\s\S]*\|$/g)
