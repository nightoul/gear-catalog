export interface Pedal {
  id: string
  name: string
  type: string
  ad: string
  power_V: number
  power_mA: number
  power_polarity: string
  bypass_type: string
  midi: boolean
  presets: boolean
  doc: string
}