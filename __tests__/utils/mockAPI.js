import { setupServer } from 'msw/node'

export default payload => {
  const { requests } = payload

  const server = setupServer(...requests)

  beforeAll(() => server.listen())
  afterEach(() => server.resetHandlers())
  afterAll(() => server.close())
}
