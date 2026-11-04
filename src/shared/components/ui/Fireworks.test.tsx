import { render } from '@testing-library/react'
import { Fireworks } from './Fireworks'

describe('Fireworks', () => {
  it('bursts over the page without being read out, attached to the body', () => {
    const { container } = render(<Fireworks />)

    expect(container).toBeEmptyDOMElement()
    const sky = document.body.querySelector('[aria-hidden="true"].fixed')
    expect(sky).toBeInTheDocument()
    expect(sky?.children).toHaveLength(60)
  })
})
