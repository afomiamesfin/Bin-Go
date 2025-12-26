import { NextResponse } from 'next/server'


export async function POST(req: Request) {
  try {
    const body = await req.json()
    const text = (body?.text || '').toString().trim().toLowerCase()

    if (!text) return NextResponse.json({ detail: 'no text provided' }, { status: 400 })

    // simple heuristic classifier
    const recyclingKeywords = ['bottle', 'plastic', 'can', 'jar', 'container', 'paper', 'cardboard', 'newspaper', 'magazine']
    const compostKeywords = ['banana', 'apple', 'peel', 'food', 'leftover', 'compostable']

    let bin = 'trash'
    if (recyclingKeywords.some(k => text.includes(k))) bin = 'recycling'
    else if (compostKeywords.some(k => text.includes(k))) bin = 'compost'

    return NextResponse.json({ bin, source: 'heuristic' })
  } catch (err) {
    return NextResponse.json({ detail: 'internal error' }, { status: 500 })
  }
}
