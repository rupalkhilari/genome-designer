Server Extensions add functionality to Genetic Constructor Server by exposing REST APIs.

Extensions export an [Express](https://expressjs.com/) [router](https://expressjs.com/en/4x/api.html#router) and are provisioned a namespaced route under which arbitrary child routes can be defined, e.g.

`/extensions/api/<extension_name>/:route`

## Accessing Genetic Constructor Functionality

At the moment, server extensions are installed at server build-time and run alongside the rest of the server.

Certain types of server extensions, e.g. conversion, are recommended to follow a provided, conventional API.

Constructor provides REST APIs that the router can call internally for accessing or persisting data.

### Possible Future Limitations

- Force API structure for some types of extensions (e.g. conversion extensions must expose routes at `/import`, `/export`, `/convert`, etc.)

- Extensions are run in their own process, which has the following consequences: ____

- Extensions are executed in their own container, and do not have access to the server's file system. Internally, extensions are provisioned in a virtual machine, and export their API through a port, to ensure that extensions can only communicate via the Constructor REST API.

- Extensions cannot overwrite user's data (e.g. PUT/POST commands are blocked), but are instead given their own section or storage.

## Express Router

### Request

The request object given to express route handers also includes information about the user, including their UUID, and takes the following form:

```javascript
req.user = {
  uuid: <uuid>,
  email: <string>,
  firstName: <string>,
  lastName; <string>,
}
```

### Response

The following are suggestions, but there are no restraints on how the extension responds:

- use semantic HTTP status codes
- respond with JSON, or plain text
