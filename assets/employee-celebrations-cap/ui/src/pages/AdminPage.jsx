import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Title,
  Button,
  Table,
  TableHeaderRow,
  TableHeaderCell,
  TableRow,
  TableCell,
  Input,
  Label,
  Dialog,
  Bar,
  FlexBox,
  Text,
  MessageStrip
} from '@ui5/webcomponents-react'
import '@ui5/webcomponents-icons/dist/add.js'
import '@ui5/webcomponents-icons/dist/edit.js'
import '@ui5/webcomponents-icons/dist/delete.js'
import '@ui5/webcomponents-icons/dist/nav-back.js'

const BASE = '/admin'

export default function AdminPage() {
  const navigate = useNavigate()
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [search, setSearch] = useState('')
  const [form, setForm] = useState({
    name: '', email: '', department: '', birthday: '', hireDate: '', photoUrl: '', githubUrl: ''
  })

  const fetchEmployees = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`${BASE}/Employees?$orderby=name`)
      if (!res.ok) throw new Error('Failed to load employees')
      const data = await res.json()
      setEmployees(data.value || [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchEmployees() }, [fetchEmployees])

  const openCreate = () => {
    setEditTarget(null)
    setForm({ name: '', email: '', department: '', birthday: '', hireDate: '', photoUrl: '' })
    setDialogOpen(true)
  }

  const openEdit = (emp) => {
    setEditTarget(emp)
    setForm({
      name: emp.name || '',
      email: emp.email || '',
      department: emp.department || '',
      birthday: emp.birthday || '',
      hireDate: emp.hireDate || '',
      photoUrl: emp.photoUrl || '',
      githubUrl: emp.githubUrl || ''
    })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    try {
      const payload = { ...form }
      if (!payload.birthday) delete payload.birthday
      if (!payload.hireDate) delete payload.hireDate
      if (!payload.email) delete payload.email
      if (!payload.photoUrl) delete payload.photoUrl
      if (!payload.githubUrl) delete payload.githubUrl

      let res
      if (editTarget) {
        res = await fetch(`${BASE}/Employees(${editTarget.ID})`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
      } else {
        res = await fetch(`${BASE}/Employees`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
      }
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: 'Request failed' }))
        throw new Error(err.error?.message || 'Request failed')
      }
      setDialogOpen(false)
      setSuccess(editTarget ? 'Employee updated successfully' : 'Employee added successfully')
      setTimeout(() => setSuccess(null), 3000)
      fetchEmployees()
    } catch (e) {
      setError(e.message)
      setTimeout(() => setError(null), 4000)
    }
  }

  const handleDelete = async () => {
    try {
      const res = await fetch(`${BASE}/Employees(${deleteTarget.ID})`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Delete failed')
      setDeleteDialogOpen(false)
      setSuccess('Employee deleted')
      setTimeout(() => setSuccess(null), 3000)
      fetchEmployees()
    } catch (e) {
      setError(e.message)
      setTimeout(() => setError(null), 4000)
    }
  }

  const filtered = employees.filter(e =>
    e.name?.toLowerCase().includes(search.toLowerCase()) ||
    e.department?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="page-container">
      <FlexBox justifyContent="SpaceBetween" alignItems="Center" style={{ marginBottom: '1rem' }}>
        <FlexBox alignItems="Center" gap="0.5rem">
          <Button icon="nav-back" design="Transparent" onClick={() => navigate('/')} />
          <Title level="H2">Employee Management</Title>
        </FlexBox>
        <div className="toolbar-actions">
          <Input
            placeholder="Search by name or department..."
            value={search}
            onInput={e => setSearch(e.target.value)}
            style={{ width: '250px' }}
          />
          <Button icon="add" design="Emphasized" onClick={openCreate}>Add Employee</Button>
        </div>
      </FlexBox>

      {error && <MessageStrip design="Negative" style={{ marginBottom: '1rem' }}>{error}</MessageStrip>}
      {success && <MessageStrip design="Positive" style={{ marginBottom: '1rem' }}>{success}</MessageStrip>}

      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <Table>
          <TableHeaderRow>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>Email</TableHeaderCell>
            <TableHeaderCell>Department</TableHeaderCell>
            <TableHeaderCell>Birthday</TableHeaderCell>
            <TableHeaderCell>Hire Date</TableHeaderCell>
            <TableHeaderCell>GitHub</TableHeaderCell>
            <TableHeaderCell>Actions</TableHeaderCell>
          </TableHeaderRow>
          {filtered.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7}>
                <div className="empty-state"><Text>No employees found.</Text></div>
              </TableCell>
            </TableRow>
          ) : (
            filtered.map(emp => (
              <TableRow key={emp.ID}>
                <TableCell><Text>{emp.name}</Text></TableCell>
                <TableCell><Text>{emp.email || '—'}</Text></TableCell>
                <TableCell><Text>{emp.department || '—'}</Text></TableCell>
                <TableCell><Text>{emp.birthday || '—'}</Text></TableCell>
                <TableCell><Text>{emp.hireDate || '—'}</Text></TableCell>
                <TableCell>
                  <FlexBox gap="0.25rem">
                    <Button icon="edit" design="Transparent" onClick={() => openEdit(emp)} />
                    <Button icon="delete" design="Transparent" onClick={() => { setDeleteTarget(emp); setDeleteDialogOpen(true) }} />
                  </FlexBox>
                </TableCell>
              </TableRow>
            ))
          )}
        </Table>
      )}

      {/* Create / Edit Dialog */}
      <Dialog
        open={dialogOpen}
        headerText={editTarget ? 'Edit Employee' : 'Add Employee'}
        footer={
          <Bar endContent={
            <FlexBox gap="0.5rem">
              <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button design="Emphasized" onClick={handleSave}>Save</Button>
            </FlexBox>
          } />
        }
        onClose={() => setDialogOpen(false)}
      >
        <div className="dialog-content">
          {[
            { label: 'Name *', key: 'name', type: 'text', placeholder: 'Full name' },
            { label: 'Email', key: 'email', type: 'email', placeholder: 'email@company.com' },
            { label: 'Department', key: 'department', type: 'text', placeholder: 'Engineering, HR, ...' },
            { label: 'Birthday', key: 'birthday', type: 'date', placeholder: 'YYYY-MM-DD' },
            { label: 'Hire Date', key: 'hireDate', type: 'date', placeholder: 'YYYY-MM-DD' },
            { label: 'Photo URL', key: 'photoUrl', type: 'text', placeholder: 'https://...' },
            { label: 'GitHub URL', key: 'githubUrl', type: 'text', placeholder: 'https://github.com/username' }
          ].map(({ label, key, type, placeholder }) => (
            <div className="form-row" key={key}>
              <Label>{label}</Label>
              <Input
                type={type === 'date' ? 'Text' : 'Text'}
                placeholder={placeholder}
                value={form[key]}
                onInput={e => setForm(f => ({ ...f, [key]: e.target.value }))}
              />
            </div>
          ))}
        </div>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        headerText="Confirm Delete"
        footer={
          <Bar endContent={
            <FlexBox gap="0.5rem">
              <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
              <Button design="Negative" onClick={handleDelete}>Delete</Button>
            </FlexBox>
          } />
        }
        onClose={() => setDeleteDialogOpen(false)}
      >
        <div className="dialog-content">
          <Text>Are you sure you want to delete <strong>{deleteTarget?.name}</strong>? This action cannot be undone.</Text>
        </div>
      </Dialog>
    </div>
  )
}
