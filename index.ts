const obj3 = {
  "title": "Nested Feedback Loop",
  "nodes": [
    { "id": "node-1", "type": "webhook", "parameters": [{ "method": "POST", "path": "/feedback" }] },
    { "id": "node-2", "type": "sentiment_analysis", "parameters": [{ "text": "{{body.message}}" }] },
    { "id": "node-3", "type": "email_send", "parameters": [{ "to": "support@company.com", "subject": "Negative Feedback", "body": "{{body.message}}" }] },
    { "id": "node-4", "type": "slack_notify", "parameters": [{ "channel": "#feedback", "message": "New feedback received" }] },
    { "id": "node-5", "type": "escalation_check", "parameters": [{ "priority": "high" }] }
  ],
  "connections": [
    { "from": "node-1", "to": "node-2" },
    { "from": "node-2", "to": "node-3" },
    { "from": "node-2", "to": "node-4" },
    { "from": "node-3", "to": "node-5" },
    { "from": "node-5", "to": "node-2" }   // loop back into sentiment analysis
  ]
}

const obj = {
  "title": "Welcome Email Flow",
  "nodes": [
    {
      "id": "node-1",
      "type": "webhook",
      "parameters": [{
        "method": "POST",
        "path": "/signup",
        "body": "Hello"
      }]

    },
    {
      "id": "node-2",
      "type": "email_send",
      "parameters": [{
        "to": "{{user.email}}",
        "subject": "Welcome to our platform",
        "body": "Thanks for signing up!",
        "from": "mycredentials@email.com"
      }]

    }
  ],
  "connections": [
    {
      "from": "node-1",
      "to": "node-2"
    }
  ]
}
const obj1 = {
  "title": "Cyclic Notification Flow",
  "nodes": [
    {
      "id": "node-1",
      "type": "webhook",
      "parameters": [{
        "method": "POST",
        "path": "/trigger",
        "body": "Start Flow"
      }]
    },
    {
      "id": "node-2",
      "type": "email_send",
      "parameters": [{
        "to": "{{user.email}}",
        "subject": "Action Required",
        "body": "Please confirm your action.",
        "from": "noreply@system.com"
      }]
    },
    {
      "id": "node-3",
      "type": "wait",
      "parameters": [{
        "duration": "5m"
      }]
    },
    {
      "id": "node-4",
      "type": "check_response",
      "parameters": [{
        "expected": "confirmed"
      }]
    }
  ],
  "connections": [
    { "from": "node-1", "to": "node-2" },
    { "from": "node-2", "to": "node-3" },
    { "from": "node-3", "to": "node-4" },
    { "from": "node-4", "to": "node-2" }   // cycle back to email_send
  ]
}

const obj2 = {
  "title": "Multi-Branch Cyclic Workflow",
  "nodes": [
    {
      "id": "node-1",
      "type": "webhook",
      "parameters": [{ "method": "GET", "path": "/start" }]
    },
    {
      "id": "node-2",
      "type": "db_query",
      "parameters": [{ "query": "SELECT * FROM users WHERE active=true" }]
    },
    {
      "id": "node-3",
      "type": "email_send",
      "parameters": [{ "to": "{{user.email}}", "subject": "Reminder", "body": "Don’t forget to finish setup!" }]
    },
    {
      "id": "node-4",
      "type": "http_request",
      "parameters": [{ "url": "https://api.example.com/status", "method": "GET" }]
    },
    {
      "id": "node-5",
      "type": "log",
      "parameters": [{ "message": "Looping workflow..." }]
    }
  ],
  "connections": [
    { "from": "node-1", "to": "node-2" },
    { "from": "node-2", "to": "node-3" },
    { "from": "node-2", "to": "node-4" },
    { "from": "node-3", "to": "node-5" },
    { "from": "node-4", "to": "node-5" },
    { "from": "node-5", "to": "node-2" }  // cycle back to DB query
  ]
}


function verifyConnection(obj: any) {
  // console.log(obj.connections)

  const incoming = new Map();
  const outgoing = new Map();
  const checkArray: any = []
  const buildGraph = (conn: any) => {
    if (incoming.get(conn.from) == null) {
      incoming.set(conn.from, 1)
    }
    else {
      const val = incoming.get(conn.from)
      incoming.set(conn.from, val + 1)
    }
    if (outgoing.get(conn.to) == null) {
      outgoing.set(conn.to, 1)
    }
    else {
      const val = outgoing.get(conn.to)
      outgoing.set(conn.to, val + 1)
    }
  }

  // const p = (v: any, o: any) => {
  //   v.from
  //
  //
  // }
  obj.connections.forEach(buildGraph)
  outgoing.forEach((value, key) => {
    incoming.forEach((value1, key1) => {
      if (key != key1) {
        checkArray.push(key1)
      }

    })
  })
  // console.log(checkArray)
  if (checkArray.length > 1) {
    console.log("more that one starting node")
  }
  obj.nodes.forEach((node: any) => {
    if (checkArray[0] == node.id) {
      if (node.type != "webhook") {
        console.log("starting node must be of type webhook")

      }
    }

  })



}
verifyConnection(obj3)
