import React from 'react'
import { minutiToText } from '../utils/utils'

type Props = {
  minuti: number
}

const TextAttesa: React.FC<Props> = ({ minuti }) => {
  return <>(circa {minutiToText(minuti)} di attesa)</>
}

export default TextAttesa
