# egf-collaboration

### installation

`npm install`

`npm run start`

### user authentication
User Authentication depends on the Bio/Nano User Platform project, which is currently not open source. If you're
reading this documentation on the `master` branch of `genome-designer`, [Drew Hylbert](mailto:drew.hylbert@autodesk.com)
has either not provided functionality to easily disable User Authentication when running the application, or the
documentation hasn't been updated.

#### manual user authentication setup
If you want to use/test user authentication locally, do the following:

1) clone the Bio/Nano User Platform repo locally.

```
git clone git@git.autodesk.com:bionano/bio-user-platform.git ~/src/bio-user-platform
```

2) Install Docker (Don't use brew, go [here](https://docs.docker.com/engine/installation/mac/).)
3) Install Bio/Nano User Platform dependencies

```
cd ~/src/bio-user-platform
npn install
```

4) Start the Authentication Service locally. Choose method:
    1) Docker storage and Docker node
    2) Docker storage + local node (easier debugging)

```
# Method i
# cd ~/src/bio-user-platform
eval "$(docker-machine env default)"
docker-compose-up
```

```
# Method ii
# in one terminal:
cd ~/src/bio-user-platform
eval "$(docker-machine env default)"
npm run storage
#
#in another terminal:
cd ~/src/bio-user-platform
npm start
```

5) Start the Genome Designer Application

If you've chosen `method ii` above, you start the Genome Designer normally with `npm start`

If you've chosen `method i` above, you need to tell the Genome Designer application to look for the Auth Service on
your docker host.

```
API_END_POINT="http://$(docker-machine ip default):8080/api" npm start
```

#### user authentication tests

Currently authentication tests in `test/server/auth/REST.spec.js` require access to an Authentication Server.