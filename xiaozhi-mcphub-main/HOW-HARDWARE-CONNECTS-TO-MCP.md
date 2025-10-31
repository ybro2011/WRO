# 🔌 How ESP32 Hardware Connects to MCP Servers

## Architecture Overview

```
ESP32 Hardware (xiaozhi firmware)
    ↓ WebSocket (wss://api.xiaozhi.me/mcp/?token=...)
MCP Hub (xiaozhi-mcphub)
    ↓ Routes requests
MCP Servers (UK Trains, UK Buses, UK News, Music, etc.)
```

---

## Connection Flow

### **1. ESP32 → MCP Hub Connection**

Your ESP32 board (running xiaozhi firmware) connects to MCP Hub via **WebSocket**:

```
WebSocket URL: wss://api.xiaozhi.me/mcp/?token=YOUR_TOKEN
```

**Where does the ESP32 get this URL?**
- It's configured in the xiaozhi platform
- The ESP32 firmware gets a WebSocket URL with an authentication token
- This connects the hardware to your MCP Hub instance

### **2. MCP Hub Configuration**

In your MCP Hub dashboard (http://localhost:3000 or Render URL):

1. Go to **"Xiaozhi Endpoints"** or **"Hardware"** section
2. Add your ESP32 device:
   - **Name:** My ESP32 Board
   - **WebSocket URL:** `wss://api.xiaozhi.me/mcp/?token=YOUR_TOKEN`
   - **Enabled:** Yes

3. MCP Hub will:
   - Connect to your ESP32 via WebSocket
   - Listen for tool requests from the hardware
   - Route requests to appropriate MCP servers

### **3. Request Routing Example**

When your ESP32 asks a question:

**User on ESP32:** "What's the next bus at Victoria Station?"

1. ESP32 → MCP Hub (via WebSocket):
   ```
   {
     "method": "tools/call",
     "params": {
       "name": "get_bus_arrivals",
       "arguments": { "stop_name": "Victoria Station" }
     }
   }
   ```

2. MCP Hub → Routes to UK Buses MCP Server:
   - MCP Hub spawns: `node uk-buses-mcp-server.js`
   - Sends the request via STDIO

3. UK Buses MCP Server → Processes request → Returns data

4. MCP Hub → Receives response → Sends back to ESP32 via WebSocket

5. ESP32 → Speaks answer through speaker

---

## Components

### **ESP32 Hardware**
- Runs xiaozhi firmware
- Connects via WebSocket to MCP Hub
- Sends voice/text requests
- Receives responses
- Outputs audio through speaker

### **MCP Hub (Your Server)**
- Bridge between hardware and MCP servers
- Manages WebSocket connections
- Routes tool calls to MCP servers
- Handles authentication

### **MCP Servers**
- Separate Node.js processes
- Provide tools (UK Trains, Buses, News, Music, etc.)
- Each server handles specific domain
- Communicate via STDIO with MCP Hub

---

## Setting Up the Connection

### **Step 1: Get Your ESP32 WebSocket URL**

1. Go to https://api.xiaozhi.me or your xiaozhi platform
2. Create or find your device/agent
3. Get the WebSocket MCP endpoint URL
4. It looks like: `wss://api.xiaozhi.me/mcp/?token=eyJhbGci...`

### **Step 2: Add Endpoint in MCP Hub**

In your MCP Hub dashboard (localhost:3000 or Render):

1. Navigate to **"Xiaozhi Endpoints"** or **"Hardware"** section
2. Click **"+ Add Endpoint"**
3. Fill in:
   - **Name:** Your ESP32 device name
   - **WebSocket URL:** (the URL from Step 1)
   - **Enabled:** Yes
   - **Group:** (optional - assigns specific MCP servers)

4. Click **"Save"**

### **Step 3: ESP32 Will Auto-Connect**

- MCP Hub will automatically connect to ESP32
- You'll see connection status in the dashboard
- Status should show "connected" when working

---

## Using MCP Servers with ESP32

Once connected:

### **Assign MCP Servers to Your ESP32**

1. Go to **"Groups"** in MCP Hub
2. Create a group for your ESP32
3. Add MCP servers to the group:
   - UK Trains
   - UK Buses
   - UK News
   - Music
4. Assign the group to your ESP32 endpoint

### **How Tools Work**

When ESP32 asks a question:
- MCP Hub receives the request
- Looks up which MCP server has the tool
- Routes to that server
- Returns the answer to ESP32
- ESP32 speaks it through the speaker

---

## Example: Full Flow

**User speaks to ESP32:** "When is the next train to London?"

1. **ESP32** captures audio → converts to text → sends to MCP Hub
2. **MCP Hub** receives: `tools/call` with `get_train_departures`
3. **MCP Hub** routes to: `UK Trains` MCP server
4. **UK Trains Server** queries mock API → returns departure times
5. **MCP Hub** receives response → sends to ESP32
6. **ESP32** converts text to speech → speaks: "The next train to London is at 2:30 PM"

---

## Current Status

Based on your logs, I can see:
- ✅ MCP Hub is running
- ✅ Already connected to an endpoint: "Breadboard-no-camera"
- ✅ Connection URL: `wss://api.xiaozhi.me/mcp/?token=...`

Your ESP32 is already connected! You just need to:
1. Add MCP servers (UK Trains, Buses, News, Music) via the dashboard
2. Assign them to your ESP32 endpoint/group
3. Start using them on your hardware!

---

## Troubleshooting

### ESP32 not connecting?
- Check WebSocket URL is correct in MCP Hub
- Verify token is valid and not expired
- Check ESP32 has internet connection
- Look at MCP Hub logs for connection errors

### Tools not working?
- Verify MCP servers are added and running
- Check MCP servers are in the same group as ESP32
- Ensure server files exist in the repository
- Check MCP Hub logs for routing errors

### ESP32 can't hear responses?
- This is an ESP32 firmware/audio issue
- Check ESP32 speaker is connected
- Verify audio codec is working
- Check ESP32 serial logs for errors




