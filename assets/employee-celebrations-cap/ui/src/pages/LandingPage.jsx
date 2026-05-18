import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Title,
  Text,
  Card,
  CardHeader,
  FlexBox,
  Button,
  Icon
} from '@ui5/webcomponents-react'
import '@ui5/webcomponents-icons/dist/employee.js'
import '@ui5/webcomponents-icons/dist/heart.js'

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="page-container landing-hero">
      <Title level="H1" style={{ marginBottom: '0.5rem' }}>🎉 Employee Celebrations</Title>
      <Text style={{ fontSize: '1.1rem', color: 'var(--sapContent_LabelColor)' }}>
        Celebrate your team's birthdays and work anniversaries
      </Text>

      <div className="landing-cards">
        <Card
          className="landing-card"
          header={
            <CardHeader
              titleText="Admin Panel"
              subtitleText="Manage employee records"
              avatar={<Icon name="employee" />}
            />
          }
          onClick={() => navigate('/admin')}
        >
          <div style={{ padding: '1rem' }}>
            <Text>Add, edit and delete employee birthday and hire date records.</Text>
            <br />
            <Button design="Emphasized" style={{ marginTop: '1rem' }} onClick={() => navigate('/admin')}>
              Open Admin Panel
            </Button>
          </div>
        </Card>

        <Card
          className="landing-card"
          header={
            <CardHeader
              titleText="Wishing Page"
              subtitleText="Today's celebrations"
              avatar={<Icon name="heart" />}
            />
          }
          onClick={() => navigate('/wishing')}
        >
          <div style={{ padding: '1rem' }}>
            <Text>View today's and upcoming birthdays & anniversaries. Send wishes to colleagues.</Text>
            <br />
            <Button design="Emphasized" style={{ marginTop: '1rem' }} onClick={() => navigate('/wishing')}>
              Open Wishing Page
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
