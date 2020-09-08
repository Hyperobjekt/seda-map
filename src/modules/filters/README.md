# Filter Module

# Filtering Data Sets

Filters are applied based an array of filter rules.

**Example:** _filter the data so it only contains items where `names` start with the letter "T"_

```js
import { applyFilters } from './filter'

// data is an array of objects
const data = [ ... ]
// array of filter rules
const filters = [
  [ "startsWith", "name", "T" ]
]
const filteredData = applyFilters(data, filters);
```

## Filter Rules

All filter rules are defined using an array

### Starts With (`startsWith`)

Filter data to contain objects with property values that start with a given value.

```
[ "startsWith", property, value ]
```

### Contains (`contains`)

Filter data to contain objects with property values that contain a given value

```
[ "contains", property, value ]
```

### Equals (`eq`)

Filter data to contain objects with property values that equal a given value

```
[ "eq", property, value ]
```

### Not Equal (`neq`)

Filter data to contain objects with property values that do not equal a given value

```
[ "neq", property, value ]
```

### Has Value (`has`)

Filter data to contain objects with property values for a given property

```
[ "has", property ]
```

### Greater Than (or Equal) (`gt` or `gte`)

Filter data to contain objects with property values that are greater than a given value

```
[ "gt", property, value ]
```

### Less Than (or Equal) (`lt` or `lte`)

Filter data to contain objects with property values that are less than a given value

```
[ "lt", property, value ]
```

### Range (`range`)

Filter values to only contain values sthat fall in the range

```
[ "range", property, [min, max]]
```

### Sort (`sort`)

Sort the data based on an object property

```
[ "sort", property, ( "asc" || "desc" ) ]
```

### Limit (`limit`)

Limit the number of returned items to the provided amount, with optional offset.

```
[ "limit", amount, offset ]
```

## Registering new filter rules

If you need a filter rule that does not exist in the list above, you can register a new one.

**Example:** _Register a filter to keep objects with property values between a range_

```js
import { registerFilterRule } from './filter'

registerFilterRule('inRange', (data, column, range) =>
  data.filter(d => d[column] > range[0] && d[column] < range[1])
)

// array of filter rules
const filters = [['inRange', 'all_avg', [0.5, 1.5]]]
const filteredData = applyFilters(data, filters)
```
