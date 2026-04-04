export interface Pedal {
  id: string
  name: string
  brand: string
  type: string
  digital: boolean
  stereo: boolean
  power_V: number
  power_mA: number
  power_polarity: string
  bypass_type: string
  midi: boolean
  presets: boolean
  expression_input: boolean | null
  doc: string
}