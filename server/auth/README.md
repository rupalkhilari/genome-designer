Referrers should send users to register at `/register`, and can send a configuration

Internally, Constructor will ensure the proper format of that payload and delegate to its internal router to register the user + set user object, and onboard the new user.

### /register

Expects payload in form:

```json
{
  user: {
   uuid: <uuid>,
   email: <email>,
   firstName: <string>,
   firstName: <string>,
  },
  config: <object of user prefs for constructor>
}
```

And creates the user object, verifies the config and merges with defaults, assigns to the user object, and then deletegates to the auth router:

### /auth/register

Expects user object in form:

```json
{
  user: {
    uuid: <uuid>,
    email: <email>,
    firstName: <string>,
    firstName: <string>,
    data: {
      constructor: true
      [userConfigKey] : <object of user prefs for constructor>
    }
  }
}
```