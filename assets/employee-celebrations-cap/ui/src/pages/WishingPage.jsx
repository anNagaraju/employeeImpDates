import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Title,
  Text,
  Card,
  CardHeader,
  Avatar,
  Button,
  Input,
  TextArea,
  Label,
  FlexBox,
  MessageStrip
} from '@ui5/webcomponents-react'
import '@ui5/webcomponents-icons/dist/employee.js'
import '@ui5/webcomponents-icons/dist/home.js'

const PUBLIC_BASE = '/public'

function CelebrationCard({ emp, onWishSent }) {
  const [wishOpen, setWishOpen] = useState(false)
  const [senderName, setSenderName] = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [wishCount, setWishCount] = useState(emp.wishCount || 0)

  const handleSendWish = async () => {
    if (!senderName.trim() || !message.trim()) return
    setSending(true)
    try {
      await fetch(`${PUBLIC_BASE}/Wishes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employee_ID: emp.ID,
          senderName: senderName.trim(),
          message: message.trim(),
          celebrationType: emp.celebrationType
        })
      })
      setSent(true)
      setWishCount(c => c + 1)
      setWishOpen(false)
      setSenderName('')
      setMessage('')
      if (onWishSent) onWishSent()
    } catch (e) {
      console.error('Failed to send wish', e)
    } finally {
      setSending(false)
    }
  }

  const isAnniversary = emp.celebrationType === 'anniversary'
  const badgeClass = isAnniversary ? 'badge-anniversary' : 'badge-birthday'
  const badgeLabel = isAnniversary
    ? `🎉 ${emp.yearsCount ? emp.yearsCount + ' Year' + (emp.yearsCount !== 1 ? 's' : '') : 'Anniversary'}`
    : '🎂 Birthday'
  const initials = emp.name ? emp.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : '??'

  return (
    <Card className="celebration-card">
      <div className="card-content">
        {emp.photoUrl
          ? <Avatar image={emp.photoUrl} size="L" />
          : <Avatar size="L"><span>{initials}</span></Avatar>
        }
        <Title level="H5">{emp.name}</Title>
        <Text style={{ color: 'var(--sapContent_LabelColor)' }}>{emp.department}</Text>
        <span className={badgeClass}>{badgeLabel}</span>
        {emp.daysUntil !== undefined && (
          <Text style={{ fontSize: '0.8rem', color: 'var(--sapContent_LabelColor)' }}>
            in {emp.daysUntil} day{emp.daysUntil !== 1 ? 's' : ''} · {emp.celebrationDate}
          </Text>
        )}
        <span className="wish-count">💌 {wishCount} wish{wishCount !== 1 ? 'es' : ''}</span>

        {sent && (
          <Text style={{ color: 'green', fontSize: '0.85rem' }}>✓ Wish sent!</Text>
        )}

        {wishOpen ? (
          <div className="wish-form">
            <Input
              placeholder="Your name"
              value={senderName}
              onInput={e => setSenderName(e.target.value)}
            />
            <TextArea
              placeholder={`Write a message for ${emp.name}...`}
              value={message}
              onInput={e => setMessage(e.target.value)}
              rows={3}
              style={{ width: '100%' }}
            />
            <FlexBox gap="0.5rem" justifyContent="Center">
              <Button onClick={() => setWishOpen(false)}>Cancel</Button>
              <Button design="Emphasized" onClick={handleSendWish} disabled={sending || !senderName.trim() || !message.trim()}>
                {sending ? 'Sending...' : 'Send Wish 💌'}
              </Button>
            </FlexBox>
          </div>
        ) : (
          <Button design="Emphasized" onClick={() => setWishOpen(true)}>
            Send Wish 💌
          </Button>
        )}
      </div>
    </Card>
  )
}

export default function WishingPage() {
  const navigate = useNavigate()
  const [todayCelebrations, setTodayCelebrations] = useState([])
  const [upcomingCelebrations, setUpcomingCelebrations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showEmbed, setShowEmbed] = useState(false)
  const embedUrl = `${window.location.origin}/wishing`

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [todayRes, upcomingRes] = await Promise.all([
        fetch(`${PUBLIC_BASE}/TodayCelebrations()`),
        fetch(`${PUBLIC_BASE}/UpcomingCelebrations()`)
      ])
      if (!todayRes.ok || !upcomingRes.ok) throw new Error('Failed to load celebrations')
      const todayData = await todayRes.json()
      const upcomingData = await upcomingRes.json()
      setTodayCelebrations(todayData.value || [])
      setUpcomingCelebrations(upcomingData.value || [])
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [fetchData])

  // Group upcoming by date
  const groupedUpcoming = upcomingCelebrations.reduce((acc, emp) => {
    const key = emp.celebrationDate || 'Unknown'
    if (!acc[key]) acc[key] = []
    acc[key].push(emp)
    return acc
  }, {})

  const formatDate = (dateStr) => {
    if (!dateStr) return dateStr
    const d = new Date(dateStr + 'T00:00:00')
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
  }

  return (
    <div className="page-container">
      <FlexBox justifyContent="SpaceBetween" alignItems="Center" style={{ marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <FlexBox alignItems="Center" gap="0.5rem">
          <Button icon="home" design="Transparent" onClick={() => navigate('/')} />
          <Title level="H2">🎉 Employee Celebrations</Title>
        </FlexBox>
        <FlexBox gap="0.5rem">
          <Button design="Default" onClick={() => setShowEmbed(s => !s)}>
            {showEmbed ? 'Hide Embed' : '⟨/⟩ Embed this page'}
          </Button>
          <Button design="Transparent" onClick={fetchData}>↻ Refresh</Button>
        </FlexBox>
      </FlexBox>

      {showEmbed && (
        <MessageStrip design="Information" hideCloseButton style={{ marginBottom: '1rem' }}>
          Embed this wishing page in your portal using this iframe snippet:
          <div className="embed-box">
            {`<iframe src="${embedUrl}" width="100%" height="700" frameborder="0" style="border:none;"></iframe>`}
          </div>
        </MessageStrip>
      )}

      {error && <MessageStrip design="Negative">{error}</MessageStrip>}

      {loading ? (
        <Text>Loading celebrations...</Text>
      ) : (
        <>
          {/* TODAY'S CELEBRATIONS */}
          <Title level="H3" className="section-header">🎊 Today's Celebrations</Title>
          {todayCelebrations.length === 0 ? (
            <div className="empty-state">
              <Text>No birthdays or anniversaries today. Check back tomorrow!</Text>
            </div>
          ) : (
            <div className="celebration-cards">
              {todayCelebrations.map(emp => (
                <CelebrationCard
                  key={`${emp.ID}-${emp.celebrationType}`}
                  emp={emp}
                  onWishSent={fetchData}
                />
              ))}
            </div>
          )}

          {/* UPCOMING CELEBRATIONS */}
          <Title level="H3" className="section-header" style={{ marginTop: '2rem' }}>
            📅 Upcoming (next 7 days)
          </Title>
          {Object.keys(groupedUpcoming).length === 0 ? (
            <div className="empty-state">
              <Text>No upcoming celebrations in the next 7 days.</Text>
            </div>
          ) : (
            Object.entries(groupedUpcoming).map(([date, emps]) => (
              <div key={date} className="upcoming-group">
                <Text className="upcoming-group-label" style={{ fontWeight: 600 }}>
                  {formatDate(date)}
                </Text>
                <div className="celebration-cards">
                  {emps.map(emp => (
                    <CelebrationCard
                      key={`${emp.ID}-${emp.celebrationType}`}
                      emp={emp}
                      onWishSent={fetchData}
                    />
                  ))}
                </div>
              </div>
            ))
          )}
        </>
      )}
    </div>
  )
}
