import { useState, useEffect } from 'react'
import axios from 'axios'

// ForgeAI admin panel — generic CRUD over every data model.
// Intentionally NOT linked from the public site; reach it directly at /admin.
const MODELS = [
  {
    "name": "User",
    "endpoint": "/api/users",
    "fields": [
      {
        "name": "username",
        "type": "String",
        "required": false,
        "enumValues": []
      },
      {
        "name": "bio",
        "type": "String",
        "required": false,
        "enumValues": []
      },
      {
        "name": "traits",
        "type": "String",
        "required": false,
        "enumValues": []
      },
      {
        "name": "avatar",
        "type": "String",
        "required": false,
        "enumValues": []
      },
      {
        "name": "isMatched",
        "type": "Boolean",
        "required": false,
        "enumValues": []
      }
    ]
  },
  {
    "name": "Message",
    "endpoint": "/api/messages",
    "fields": [
      {
        "name": "senderId",
        "type": "String",
        "required": false,
        "enumValues": []
      },
      {
        "name": "receiverId",
        "type": "String",
        "required": false,
        "enumValues": []
      },
      {
        "name": "content",
        "type": "String",
        "required": false,
        "enumValues": []
      },
      {
        "name": "timestamp",
        "type": "Date",
        "required": false,
        "enumValues": []
      }
    ]
  }
]

function ModelManager({ model }) {
  const [rows, setRows] = useState([])
  const [form, setForm] = useState({})
  const [editing, setEditing] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const { data } = await axios.get(model.endpoint)
      setRows(Array.isArray(data) ? data : (data.items || data.data || []))
      setError('')
    } catch (e) {
      setError('Failed to load ' + model.name + 's')
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => { load() }, [])

  const set = (name, isBool) => (e) =>
    setForm((f) => ({ ...f, [name]: isBool ? e.target.checked : e.target.value }))

  const reset = () => { setForm({}); setEditing(null) }

  const submit = async (e) => {
    e.preventDefault()
    // Build a clean payload: coerce types and OMIT empty values so an empty
    // number/date never gets sent as "" (which fails the server's cast -> 400).
    const payload = {}
    model.fields.forEach((f) => {
      let v = form[f.name]
      if (f.type === 'Boolean') { payload[f.name] = !!v; return }
      if (v === '' || v == null) return // skip empties — let the server use defaults/required rules
      if (f.type === 'Number') { const n = Number(v); if (!Number.isNaN(n)) payload[f.name] = n; return }
      payload[f.name] = v
    })
    try {
      if (editing) await axios.put(model.endpoint + '/' + editing, payload)
      else await axios.post(model.endpoint, payload)
      reset()
      await load()
    } catch (err) {
      const d = err.response && err.response.data
      setError((d && (d.message || d.error)) || err.message || 'Save failed — check the required fields')
    }
  }

  const edit = (row) => { setEditing(row._id); setForm(row) }

  const remove = async (id) => {
    if (!window.confirm('Delete this record?')) return
    try { await axios.delete(model.endpoint + '/' + id); await load() }
    catch (err) { setError('Delete failed') }
  }

  return (
    <section className="admin-model card">
      <h2 className="admin-model-title">{model.name}</h2>
      {error && <p className="admin-error">{error}</p>}
      <form className="admin-form" onSubmit={submit}>
        {model.fields.map((f) => (
          <label key={f.name} className="admin-field">
            <span className="admin-label">{f.name}{f.required ? ' *' : ''}</span>
            {f.enumValues && f.enumValues.length ? (
              <select className="admin-input" value={form[f.name] == null ? '' : form[f.name]} onChange={set(f.name)}>
                <option value="">— select —</option>
                {f.enumValues.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            ) : f.type === 'Boolean' ? (
              <input type="checkbox" checked={!!form[f.name]} onChange={set(f.name, true)} />
            ) : (
              <input
                className="admin-input"
                type={f.type === 'Number' ? 'number' : f.type === 'Date' ? 'date' : 'text'}
                value={form[f.name] == null ? '' : form[f.name]}
                onChange={set(f.name)}
              />
            )}
          </label>
        ))}
        <div className="admin-actions">
          <button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Create'}</button>
          {editing && (
            <button type="button" className="btn btn-secondary" onClick={reset}>Cancel</button>
          )}
        </div>
      </form>
      {loading ? (
        <p className="admin-loading">Loading…</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                {model.fields.map((f) => <th key={f.name}>{f.name}</th>)}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr><td className="admin-empty" colSpan={model.fields.length + 1}>No records yet.</td></tr>
              )}
              {rows.map((row) => (
                <tr key={row._id}>
                  {model.fields.map((f) => (
                    <td key={f.name}>
                      {typeof row[f.name] === 'boolean'
                        ? (row[f.name] ? 'Yes' : 'No')
                        : String(row[f.name] == null ? '' : row[f.name])}
                    </td>
                  ))}
                  <td className="admin-row-actions">
                    <button className="btn btn-secondary" onClick={() => edit(row)}>Edit</button>
                    <button className="btn btn-secondary" onClick={() => remove(row._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

export default function Admin() {
  return (
    <main className="admin container">
      <header className="admin-head">
        <h1>Admin Panel</h1>
        <p className="admin-sub">Manage your application's data. This page is not linked from the public site.</p>
      </header>
      {MODELS.map((m) => <ModelManager key={m.name} model={m} />)}
    </main>
  )
}
