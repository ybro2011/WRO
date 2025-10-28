#!/usr/bin/env node

/**
 * UK Buses MCP Server
 * Provides real-time UK bus information including arrivals, stops, routes, and disruptions
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

const server = new Server(
  {
    name: 'uk-buses-mcp',
    version: '1.0.0',
    description: 'Real-time UK bus information including arrivals, stops, routes, and disruptions'
  },
  {
    capabilities: {
      tools: {}
    }
  }
);

// Mock data storage
let mockStops = [
  { id: '490015840C', name: 'Victoria Station', latitude: 51.4948, longitude: -0.1427 },
  { id: '490012080N', name: 'Oxford Circus Station', latitude: 51.5151, longitude: -0.1409 },
  { id: '490018418E', name: 'Piccadilly Circus', latitude: 51.5098, longitude: -0.1341 }
];

let mockRoutes = [
  { id: '38', name: '38', destination: 'Victoria', operator: 'Arriva London' },
  { id: '10', name: '10', destination: 'Hammersmith', operator: 'Transport for London' },
  { id: '55', name: '55', destination: 'Leicester Square', operator: 'Stagecoach London' }
];

// Tool: Get bus arrivals for a stop
server.setRequestHandler('tools/list', async () => {
  return {
    tools: [
      {
        name: 'get_bus_arrivals',
        description: 'Get real-time bus arrivals for a specific bus stop by stop ID or name',
        inputSchema: {
          type: 'object',
          properties: {
            stop_id: { type: 'string', description: 'Bus stop ID (e.g., "490015840C")' },
            stop_name: { type: 'string', description: 'Bus stop name (e.g., "Victoria Station")' }
          },
          required: ['stop_id']
        }
      },
      {
        name: 'search_bus_stops',
        description: 'Search for bus stops by name or location',
        inputSchema: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'Search term for bus stop name or location' }
          },
          required: ['query']
        }
      },
      {
        name: 'get_bus_routes',
        description: 'Get information about bus routes',
        inputSchema: {
          type: 'object',
          properties: {
            route_id: { type: 'string', description: 'Route ID or number (e.g., "38")' },
            destination: { type: 'string', description: 'Destination name to filter routes' }
          }
        }
      },
      {
        name: 'get_bus_disruptions',
        description: 'Get current bus service disruptions and alerts',
        inputSchema: {
          type: 'object',
          properties: {
            route_id: { type: 'string', description: 'Optional: Filter by specific route ID' }
          }
        }
      },
      {
        name: 'get_stop_information',
        description: 'Get detailed information about a bus stop including facilities',
        inputSchema: {
          type: 'object',
          properties: {
            stop_id: { type: 'string', description: 'Bus stop ID' }
          },
          required: ['stop_id']
        }
      },
      {
        name: 'find_nearby_stops',
        description: 'Find bus stops near a specific location using latitude and longitude',
        inputSchema: {
          type: 'object',
          properties: {
            latitude: { type: 'number', description: 'Latitude of the location' },
            longitude: { type: 'number', description: 'Longitude of the location' },
            radius: { type: 'number', description: 'Search radius in meters (default: 500)' }
          },
          required: ['latitude', 'longitude']
        }
      }
    ]
  };
});

// Tool handlers
server.setRequestHandler('tools/call', async (request) => {
  const { name, arguments: args } = request.params;

  if (name === 'get_bus_arrivals') {
    const { stop_id, stop_name } = args;
    const stop = mockStops.find(s => s.id === stop_id || s.name === stop_name);
    
    if (!stop) {
      throw new Error(`Bus stop not found: ${stop_id || stop_name}`);
    }

    const arrivals = [
      {
        route: '38',
        destination: 'Victoria',
        arrival_time: '2 min',
        scheduled_time: new Date(Date.now() + 2 * 60000).toISOString(),
        vehicle_id: '12345',
        operator: 'Arriva London'
      }
    ];

    return {
      content: [{
        type: 'text',
        text: JSON.stringify({ stop_id: stop.id, stop_name: stop.name, arrivals, timestamp: new Date().toISOString() }, null, 2)
      }]
    };
  }

  if (name === 'search_bus_stops') {
    const { query } = args;
    const results = mockStops.filter(stop => stop.name.toLowerCase().includes(query.toLowerCase()));
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({ query, results }, null, 2)
      }]
    };
  }

  if (name === 'get_bus_routes') {
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({ routes: mockRoutes, timestamp: new Date().toISOString() }, null, 2)
      }]
    };
  }

  if (name === 'get_bus_disruptions') {
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({ disruptions: [], count: 0, timestamp: new Date().toISOString() }, null, 2)
      }]
    };
  }

  if (name === 'get_stop_information') {
    const { stop_id } = args;
    const stop = mockStops.find(s => s.id === stop_id);
    if (!stop) throw new Error(`Bus stop not found: ${stop_id}`);
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({ ...stop, facilities: ['Shelter', 'Real-time displays'] }, null, 2)
      }]
    };
  }

  if (name === 'find_nearby_stops') {
    const { latitude, longitude, radius = 500 } = args;
    const nearbyStops = mockStops.slice(0, 3);
    return {
      content: [{
        type: 'text',
        text: JSON.stringify({ location: { latitude, longitude }, radius_meters: radius, stops: nearbyStops }, null, 2)
      }]
    };
  }

  throw new Error(`Unknown tool: ${name}`);
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('UK Buses MCP server running on stdio');
}

main().catch(console.error);

