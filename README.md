# Simple GRAKN API

Alternative package for a more simple way to connect to the grakn api.
It principal use case is to execute 'GRAQL' queries on the data base
but you can also make GET request to different endpoints.

### Prerequisites

You need to have installed GRAKN and an instance running: [GRAKN website](https://grakn.ai/).  
By default, GRAKN runs at `localhost:4567` with the keyspace `grakn`, but you can change that.
To reflect this into this app you must change these environment variables:
* `GRAKN_HOST`
* `GRAKN_PORT`
* `GRAKN_KEYSPACE`

Or provide different values in the `options` argument, see [options](https://github.com/SetaSouto/grakn-api#options).

By default the *protocol* used is `http` (to work on localhost) but if you
want to use `https` you should change the environment variable `NODE_ENV` to `production` or
the correspondent option, see [options](https://github.com/SetaSouto/grakn-api#options).

### Installation

```bash
npm install --save grakn-api
```

### Usage

Is as simple as
```javascript
const grakn = require('grakn-api')
grakn.execute('match isa person has name $name; get;')
  .then(res => console.log(res)) // Do what you want with the response
  .catch(err => console.error(err)
```

If you want to list the available keyspaces you can run
```javascript
grakn.getKeyspaces()
  .then(res => console.log(res))
  .catch(err => console.error(err))
```

To get something for a specific path you can run
```javascript
grakn.get('/kb/path/to/something')
  .then(res => // Do something with the response)
  .catch(err => // Catch the error)
```

### Options

When you create the grakn service you can pass it an object with
options:
```javascript
require('grakn-api')({
  keyspace: string, // Ex: 'grakn'
  hostname: string, // Ex: www.mygrakndatabase.com
  port: number, // Ex: 4567
  protocol: string // 'http' or 'https'
})
```
Or provide the defaults as environment variables.

### Author

Fabián Souto Herrera  
[fab.souto@gmail.com](mailto:fab.souto@gmail.com)