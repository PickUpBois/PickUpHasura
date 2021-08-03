import requests

url = 'http://localhost:5000/v1/metadata'

headers=  {
    'X-Hasura-Role': 'admin'
}

body = {
    'type': 'pg_track_table',
    'args': {
        'table': 'hdb_catalog.hdb_scheduled_events',
        'source': 'default'
    }
}

resp = requests.post(url=url, headers=headers, json=body)
print(resp.status_code)
print(resp.json())