import Regions from "./regions"
import Districts from "./districts"
import Circuits from "./circuits"

const createRDCDropDownOptions = () => {
  let data = []

  for (let region of Regions) {
    if (!region.Region) {
      continue
    }

    data.push({
      value: region.Region,
      label: region.Region,
      isDisabled: true,
    })

    let RegionDistricts = Districts.filter(
      district => district.Region === region.Region
    )

    for (let district of RegionDistricts) {
      if (!district.District) {
        continue
      }

      let temp = region.Region + ", " + district.District

      data.push({
        value: temp,
        label: temp,
        isDisabled: true,
      })

      let RegionDistrictCircuits = Circuits.filter(
        circuit =>
          circuit.Region === region.Region &&
          circuit.District === district.District
      )

      for (let circuit of RegionDistrictCircuits) {
        if (!circuit.Circuit) {
          continue
        }

        let temp =
          region.Region + ", " + district.District + ", " + circuit.Circuit

        data.push({
          value: temp,
          label: temp,
        })
      }
    }
  }

  return data
}

export default createRDCDropDownOptions()
