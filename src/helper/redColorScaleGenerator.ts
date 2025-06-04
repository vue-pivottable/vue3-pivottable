export function redColorScaleGenerator(values: number[]) {
  const min = Math.min.apply(Math, values)
  const max = Math.max.apply(Math, values)
  return (x: number) => {
    const nonRed = 255 - Math.round((255 * (x - min)) / (max - min))
    return { backgroundColor: `rgb(255,${nonRed},${nonRed})` }
  }
}
