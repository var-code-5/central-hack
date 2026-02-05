'use client'

import React, { useState } from 'react'

interface TimelineEvent {
  id: string
  day: string
  title: string
  events: {
    time: string
    description: string
  }[]
}

const timelineData: TimelineEvent[] = [
  {
    id: 'day-1',
    day: 'FEB 4 (Wed)',
    title: 'Registration Launch',
    events: [
      { time: 'Full day', description: 'Hackathon Registration Website launch, Tracks' },
      { time: 'Full day', description: 'Registration and Round 0 starts' },
    ],
  },
  {
    id: 'day-2',
    day: 'FEB 7 (Sat)',
    title: 'Round 0 Deadline',
    events: [
      { time: 'EOD', description: 'Registration Closes' },
      { time: 'EOD', description: 'Round 0 ends' },
    ],
  },
  {
    id: 'day-3',
    day: 'FEB 8 (Sun)',
    title: 'Evaluation',
    events: [
      { time: 'Full day', description: 'Internal Evaluation of submissions and shortlisting' },
    ],
  },
  {
    id: 'day-4',
    day: 'FEB 9 (Mon)',
    title: 'Notification',
    events: [
      { time: 'Full day', description: 'Inform round 1 shortlisted participants' },
      { time: 'Full day', description: 'Get confirmation for Hardware requirements (if any)' },
    ],
  },
  {
    id: 'day-5',
    day: 'FEB 13 (Fri)',
    title: 'Round 1',
    events: [
      { time: '8:00 am', description: 'Participants check-in' },
      { time: '9:00 am', description: 'Round 1 starts' },
      { time: '12:30 pm - 2:00 pm', description: 'Lunch Break' },
      { time: '4:00 pm - 7:00 pm', description: 'Review 1' },
      { time: '7:30 pm', description: 'Round 1 qualified list release' },
      { time: '7:30 pm - 9:00 pm', description: 'Dinner' },
      { time: '9:00 pm', description: 'Round 2 qualified participants Check-in' },
    ],
  },
  {
    id: 'day-6',
    day: 'FEB 14 (Sat)',
    title: 'Round 2',
    events: [
      { time: '6:00 am - 8:00 am', description: 'Break for participants' },
      { time: '8:00 am', description: 'Participants check-in after breakfast' },
      { time: '12:30 pm - 2:00 pm', description: 'Lunch Break' },
      { time: '3:00 pm - 6:00 pm', description: 'Review 2' },
      { time: '7:00 pm', description: 'Round 3 qualified list release' },
      { time: '7:30 pm - 9:00 pm', description: 'Dinner break' },
      { time: '9:00 pm', description: 'Round 3 qualified participants Check-in' },
    ],
  },
  {
    id: 'day-7',
    day: 'FEB 15 (Sun)',
    title: 'Final Round',
    events: [
      { time: '6:00 am - 8:00 am', description: 'Break for participants' },
      { time: '8:00 am', description: 'Participants check-in after breakfast' },
      { time: '12:30 pm - 2:00 pm', description: 'Lunch Break' },
      { time: '2:00 pm - 5:00 pm', description: 'Final Review' },
      { time: '6:00 pm onwards', description: 'Yantra Valedictory' },
    ],
  },
]

export default function Time() {
  const [selectedDay, setSelectedDay] = useState<string>('day-1')

  return (
    <div className="min-h-screen bg-linear-to-b from-black to-c-green/20 p-8 font-jetbrains-mono my-auto">
      {/* Main container */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Left Sidebar */}
        <div className="flex flex-col gap-12">
          {/* Header */}
          <div className="">
            <div className="text-lg text-c-green mb-2">// TIMELINE.exe</div>
            <h1 className="text-5xl font-bold text-white mb-6">TIMELINE</h1>
            <p className=" text-white  font-space-grotesk text-">
              Yantra cental hack is a 36-hour hackathon focused on leveraging
              Web3 technologies for social responsibility. Participants will
              collaborate to create innovative solutions that address pressing
              social issues using blockchain, decentralized applications, and
              other Web3 tools.
            </p>
          </div>

          {/* Event List */}
          <div className="space-y-2">
            {timelineData.map((event, index) => (
              <button
                key={event.id}
                onClick={() => setSelectedDay(event.id)}
                className={`w-full text-left p-4 border-l-2 border-c-green transition-all ${
                  selectedDay === event.id
                    ? 'bg-c-green text-black font-bold'
                    : 'bg-transparent text-c-green hover:bg-green-950'
                }`}
              >
                <span className="inline-block mr-2">
                  {selectedDay === event.id ? '▶' : ' '}
                </span>
                {`{${event.day}} ${event.title}`}
              </button>
            ))}
          </div>

          {/* Visualizer */}
          <div className="hidden md:flex items-end justify-center gap-6 h-48">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-2"
                style={{
                  animation: `pulse ${0.8 + Math.random() * 0.4}s ease-in-out infinite`,
                  animationDelay: `${i * 0.05}s`,
                }}
              >
                <div className="h-2 w-2 rounded-full bg-c-green"></div>
                <div
                  className="w-1 bg-c-green"
                  style={{ height: `${30 + Math.random() * 70}px` }}
                ></div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Content */}
        <div className="overflow-x-auto h-full">
          <div className="border-l-4 border-c-green pl-6 space-y-4 h-full">
            {/* Timeline data display */}
            {timelineData
              .filter((item) => item.id === selectedDay)
              .map((dayData) => (
                <div key={dayData.id} className="space-y-4">
                  {/* Day header */}
                  <div className="text-xs text-green-600 mb-2">
                    {`// ${dayData.day}`}
                  </div>
                  <div className="bg-c-green text-black px-4 py-2 font-bold text-sm w-full">
                    {dayData.day}
                  </div>

                  {/* Events table */}
                  <div className="space-y-2 mt-6">
                    <div className="text-lg  text-c-green">// </div>
                    <div className="flex gap-2 border-l-2 border-c-green border-dashed pl-6">
                      <div className="text-lg  text-c-green">+</div>
                      <div className="flex-1 border-b-2 border-c-green border-dashed"></div>
                      <div className="text-lg  text-c-green">+</div>
                      <div className="flex-1 border-b-2 border-c-green border-dashed"></div>
                      <div className="text-lg  text-c-green">+</div>
                    </div>
                    <div className="flex gap-2 border-l-2 border-c-green border-dashed pl-6">
                      <div className="text-lg  text-c-green">|</div>
                      <div className="flex-1 text-center text-lg  font-bold text-c-green">
                        Timing
                      </div>
                      <div className="text-lg  text-c-green">|</div>
                      <div className="flex-1 text-center text-lg  font-bold text-c-green">
                        Description
                      </div>
                      <div className="text-lg  text-c-green">|</div>
                    </div>
                    <div className="flex gap-2 border-l-2 border-c-green border-dashed pl-6">
                      <div className="text-lg  text-c-green">+</div>
                      <div className="flex-1 border-b-2 border-c-green border-dashed"></div>
                      <div className="text-lg  text-c-green">+</div>
                      <div className="flex-1 border-b-2 border-c-green border-dashed"></div>
                      <div className="text-lg  text-c-green">+</div>
                    </div>

                    {/* Event rows */}
                    {dayData.events.map((event, idx) => (
                      <div key={idx} className="space-y-0">
                        <div className="flex gap-2 border-l-2 border-c-green border-dashed pl-6">
                          <div className="text-lg  text-c-green">|</div>
                          <div className="flex-1 py-2 px-2 text-lg  text-c-green">
                            {event.time}
                          </div>
                          <div className="text-lg  text-c-green">|</div>
                          <div className="flex-1 py-2 px-2 text-lg  text-c-green">
                            {event.description}
                          </div>
                          <div className="text-lg  text-c-green">|</div>
                        </div>
                        <div className="flex gap-2 border-l-2 border-c-green border-dashed pl-6">
                          <div className="text-lg  text-c-green">+</div>
                          <div className="flex-1 border-b-2 border-c-green border-dashed"></div>
                          <div className="text-lg  text-c-green">+</div>
                          <div className="flex-1 border-b-2 border-c-green border-dashed"></div>
                          <div className="text-lg  text-c-green">+</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="text-xs text-green-600 mt-4">// </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}
