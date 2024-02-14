import regions from "./regions"
import districts from "./districts"
import circuits from "./circuits"

const createRDCDropDownAllSelectableOptions = () => {
  let data = []

  for (let region of regions) {
    if (!region.region) {
      continue
    }

    data.push({
      value: region.id,
      label: region.region,
    })

    let RegionDistricts = districts.filter(
      district => district.regionId === region.id
    )

    for (let district of RegionDistricts) {
      if (!district.district) {
        continue
      }

      let value = region.id + "-" + district.id
      let label = region.region + ", " + district.district

      data.push({
        value,
        label,
      })

      let RegionDistrictCircuits = circuits.filter(
        circuit => circuit.districtId === district.id
      )

      for (let circuit of RegionDistrictCircuits) {
        if (!circuit.circuit) {
          continue
        }

        let value = region.id + "-" + district.id + "-" + circuit.id
        let label =
          region.region + ", " + district.district + ", " + circuit.circuit

        data.push({
          value,
          label,
        })
      }
    }
  }

  return data
}

export default createRDCDropDownAllSelectableOptions()
