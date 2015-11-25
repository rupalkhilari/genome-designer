from requests import get as GET
from requests import put as PUT
from requests import post as POST
from json import dumps as json

url = "http://0.0.0.0:3000/api/"

block1 = {
  "metadata": {
    "authors": [],
    "version": "0.0.0",
    "tags": {}  },
  "options":[],
  "components":[],
  "rules": [],
  "notes": {}
}

block2 = {
  "metadata": {
    "authors": [],
    "version": "0.0.0",
    "tags": {}
  },
  "options":[],
  "components":[],
  "rules": [],
  "notes": {}
}

login = GET(url + "login", params={"user":"", "password":""});
headers = {  "Content-type": "application/json", "session-key": login.json()["session-key"] };

res = POST(url + "block", data = json(block1), headers=headers)
id1 = res.json()['id']

res = POST(url + "block", data = json(block2), headers=headers)
id2 = res.json()['id']

block3 = {
 "metadata": {
    "authors": [],
    "version": "0.0.0",
    "tags": {}
  },
  "components": [
    id1,
    id2
  ],
  "options":[],
  "rules": [],
  "notes": {}
}

block4 = {
 "metadata": {
    "authors": [],
    "version": "0.0.0",
    "tags": {}
  },
  "options": [
    id1,
    id2
  ],
  "components":[],
  "rules": [],
  "notes": {}
}

res = POST(url + "block", data = json(block3), headers=headers)
id3 = res.json()['id']

res = POST(url + "block", data = json(block4), headers=headers)
id4 = res.json()['id']

proj1 = {
 "metadata": {
    "authors": [],
    "version": "0.0.0",
    "tags": {}
  },
  "components": [
    id3,
    id4
  ],
  "settings": {}
}

res = POST(url + "project", data = json(proj1), headers=headers)
pid1 = res.json()['id']

proj1["settings"] = { "SBOLv-version": "1.2.0" }

res = PUT(url + "project/" + pid1, data = json(proj1), headers=headers)
pid1 = res.json()['id']

res = GET(url + "project/" + pid1, params = {"tree":True}, headers=headers)

res = POST(url + "clone/" + pid1, headers=headers)
pid2 = res.json()['id']

res = POST(url + "clone/" + pid2, headers=headers)
pid3 = res.json()['id']

res = POST(url + "clone/" + pid3, headers=headers)
pid4 = res.json()['id']

res = GET(url + "project/" + pid4, headers=headers)

hist = GET(url + "ancestors/" + pid4, headers=headers)

child = GET(url + "descendants/" + pid1, headers=headers)

#Test extensions
url = "http://0.0.0.0:3000/extensions/run/"
input1 = {"DNA":"ACGTACGACTACGACTGACGACTACGAGCT"}
res = POST(url + "translate_dna_example", data = json(input1), headers=headers)
