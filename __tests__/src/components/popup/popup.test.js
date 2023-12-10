import { fireEvent, screen } from '@testing-library/react'
import React from 'react'

import Popup from '../../../../src/components/popup'
import constantsTestid from '../../../../src/constants/testid'
import { renderWithProviders } from '../../../utils/renderWithProviders'

describe('popup', () => {
  const testid = constantsTestid.popup

  test('should be rendered without having any problems', () => {
    renderWithProviders(<Popup>test</Popup>)
    expect(screen.queryByTestId(testid.popupContainer)).toBeInTheDocument()
  })

  test('should be triggered disable handle function when clicking close button', () => {
    const mockDisableHandle = jest.fn()
    renderWithProviders(
      <Popup enabled={true} disableHandle={mockDisableHandle}>
        test
      </Popup>
    )

    fireEvent.click(screen.getByTestId(testid.closeButton))

    expect(mockDisableHandle.mock.calls).toHaveLength(1)
  })

  test('should be have same content with children content', () => {
    const mockContent = '<div>test content</div>'
    renderWithProviders(<Popup enabled={true}>{mockContent}</Popup>)

    expect(screen.getByTestId(testid.content)).toHaveTextContent(mockContent)
  })

  test('should be enabled popup when the enabled prop is true', () => {
    renderWithProviders(
      <Popup enabled>
        <div>test content</div>
      </Popup>
    )

    expect(screen.getByTestId(testid.popupContentContainer)).toHaveStyle('display: flex;')
    expect(screen.getByTestId(testid.popupBackground)).toHaveStyle('display: block;')
  })

  test('should be disabled popup when the enabled prop is false', () => {
    renderWithProviders(
      <Popup enabled={false}>
        <div>test content</div>
      </Popup>
    )

    expect(screen.getByTestId(testid.popupContentContainer)).toHaveStyle('display: none;')
    expect(screen.getByTestId(testid.popupBackground)).toHaveStyle('display: none;')
  })
})
