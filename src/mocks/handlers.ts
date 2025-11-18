import { http, HttpResponse, delay } from 'msw'
import data from './data/products.json'
import type { Product, ListResponse } from '../../types'

let products: Product[] = JSON.parse(JSON.stringify(data))

function paginate<T>(items: T[], page:number, limit:number){
  const start = (page-1)*limit
  return items.slice(start, start+limit)
}

export const handlers = [
  http.get('/products', async ({ request }) => {
    const url = new URL(request.url)
    const page = Number(url.searchParams.get('page') || 1)
    const limit = Number(url.searchParams.get('limit') || 8)
    const query = url.searchParams.get('query')?.toLowerCase() || ''
    const category = url.searchParams.get('category') || ''
    await delay(200)
    let list = products.filter(p => p.name.toLowerCase().includes(query))
    if (category) list = list.filter(p => p.category === category)
    const body: ListResponse<Product> = { items: paginate(list, page, limit), page, limit, total: list.length }
    return HttpResponse.json(body)
  }),

  http.get('/products/:id', async ({ params }) => {
    await delay(150)
    const found = products.find(p => p.id === params.id)
    return found ? HttpResponse.json(found) : new HttpResponse(null, { status: 404 })
  })
]
