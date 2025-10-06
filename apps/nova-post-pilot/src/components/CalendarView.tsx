// Calendar View - Vista de calendario de Nova Post Pilot del universo Son1kVerse

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNovaStore } from '../store/useNovaStore';

export function CalendarView() {
  const { posts, selectedDate, setSelectedDate, calendarView, setCalendarView } = useNovaStore();
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const getPostsForDate = (date: Date) => {
    return posts.filter(post => {
      const postDate = new Date(post.scheduledDate);
      return postDate.toDateString() === date.toDateString();
    });
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const days = getDaysInMonth(currentMonth);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  return (
    <div className="calendar-view">
      <div className="calendar-view__header">
        <h2>📅 Content Calendar</h2>
        
        <div className="calendar-controls">
          <button onClick={handlePrevMonth} className="control-button">
            ←
          </button>
          
          <h3 className="month-year">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>
          
          <button onClick={handleNextMonth} className="control-button">
            →
          </button>
        </div>
      </div>

      <div className="calendar-view__content">
        <div className="calendar-grid">
          {/* Day headers */}
          <div className="calendar-header">
            {dayNames.map(day => (
              <div key={day} className="day-header">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar days */}
          <div className="calendar-days">
            {days.map((day, index) => {
              if (!day) {
                return <div key={index} className="calendar-day empty" />;
              }
              
              const dayPosts = getPostsForDate(day);
              const isSelected = selectedDate && day.toDateString() === selectedDate.toDateString();
              const isToday = day.toDateString() === new Date().toDateString();
              
              return (
                <motion.div
                  key={day.getTime()}
                  className={`calendar-day ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
                  onClick={() => handleDateClick(day)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="day-number">{day.getDate()}</div>
                  
                  {dayPosts.length > 0 && (
                    <div className="day-posts">
                      {dayPosts.slice(0, 3).map((post, postIndex) => (
                        <div
                          key={post.id}
                          className={`post-indicator ${post.status}`}
                          title={post.title}
                        />
                      ))}
                      {dayPosts.length > 3 && (
                        <div className="more-posts">+{dayPosts.length - 3}</div>
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
        
        {/* Selected date posts */}
        {selectedDate && (
          <div className="selected-date-posts">
            <h3>Posts for {selectedDate.toLocaleDateString()}</h3>
            <div className="posts-list">
              {getPostsForDate(selectedDate).map(post => (
                <div key={post.id} className="post-item">
                  <div className="post-status">{post.status}</div>
                  <div className="post-content">
                    <h4>{post.title}</h4>
                    <p>{post.content}</p>
                    <div className="post-platforms">
                      {post.platforms.map(platform => (
                        <span key={platform.name} className="platform-tag">
                          {platform.icon} {platform.displayName}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <style jsx>{`
        .calendar-view {
          padding: var(--spacing-lg);
          height: 100%;
          overflow-y: auto;
        }
        
        .calendar-view__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--spacing-lg);
        }
        
        .calendar-view__header h2 {
          margin: 0;
          color: var(--accent-primary);
          font-size: 24px;
        }
        
        .calendar-controls {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
        }
        
        .control-button {
          background: rgba(0, 255, 231, 0.1);
          border: 1px solid rgba(0, 255, 231, 0.3);
          border-radius: var(--border-radius-md);
          color: var(--text-primary);
          cursor: pointer;
          padding: var(--spacing-sm) var(--spacing-md);
          transition: all var(--transition-fast);
        }
        
        .control-button:hover {
          background: rgba(0, 255, 231, 0.2);
        }
        
        .month-year {
          margin: 0;
          color: var(--text-primary);
          font-size: 18px;
          font-weight: 600;
        }
        
        .calendar-grid {
          background: rgba(26, 29, 38, 0.8);
          border: 1px solid rgba(0, 255, 231, 0.3);
          border-radius: var(--border-radius-lg);
          overflow: hidden;
        }
        
        .calendar-header {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          background: rgba(0, 255, 231, 0.1);
        }
        
        .day-header {
          padding: var(--spacing-md);
          text-align: center;
          font-weight: 600;
          color: var(--accent-primary);
          border-right: 1px solid rgba(0, 255, 231, 0.2);
        }
        
        .day-header:last-child {
          border-right: none;
        }
        
        .calendar-days {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
        }
        
        .calendar-day {
          min-height: 100px;
          padding: var(--spacing-sm);
          border-right: 1px solid rgba(0, 255, 231, 0.2);
          border-bottom: 1px solid rgba(0, 255, 231, 0.2);
          cursor: pointer;
          transition: all var(--transition-fast);
          position: relative;
        }
        
        .calendar-day:hover {
          background: rgba(0, 255, 231, 0.05);
        }
        
        .calendar-day.selected {
          background: rgba(0, 255, 231, 0.15);
        }
        
        .calendar-day.today {
          background: rgba(0, 255, 231, 0.1);
        }
        
        .calendar-day.today .day-number {
          color: var(--accent-primary);
          font-weight: 700;
        }
        
        .day-number {
          font-size: 14px;
          font-weight: 500;
          color: var(--text-primary);
        }
        
        .day-posts {
          margin-top: var(--spacing-xs);
          display: flex;
          flex-wrap: wrap;
          gap: 2px;
        }
        
        .post-indicator {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
        
        .post-indicator.draft {
          background: #ffaa00;
        }
        
        .post-indicator.scheduled {
          background: #00d4ff;
        }
        
        .post-indicator.published {
          background: #00ff00;
        }
        
        .post-indicator.failed {
          background: #ff6b6b;
        }
        
        .more-posts {
          font-size: 10px;
          color: var(--text-muted);
          font-family: var(--font-mono);
        }
        
        .selected-date-posts {
          margin-top: var(--spacing-lg);
          background: rgba(26, 29, 38, 0.8);
          border: 1px solid rgba(0, 255, 231, 0.3);
          border-radius: var(--border-radius-lg);
          padding: var(--spacing-lg);
        }
        
        .selected-date-posts h3 {
          margin: 0 0 var(--spacing-md) 0;
          color: var(--accent-primary);
        }
        
        .posts-list {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }
        
        .post-item {
          display: flex;
          gap: var(--spacing-md);
          padding: var(--spacing-md);
          background: rgba(0, 0, 0, 0.3);
          border-radius: var(--border-radius-md);
          border: 1px solid rgba(0, 255, 231, 0.2);
        }
        
        .post-status {
          padding: var(--spacing-xs) var(--spacing-sm);
          border-radius: var(--border-radius-sm);
          font-size: 10px;
          text-transform: uppercase;
          font-weight: 600;
          letter-spacing: 0.5px;
        }
        
        .post-status.draft {
          background: rgba(255, 170, 0, 0.2);
          color: #ffaa00;
        }
        
        .post-status.scheduled {
          background: rgba(0, 212, 255, 0.2);
          color: #00d4ff;
        }
        
        .post-status.published {
          background: rgba(0, 255, 0, 0.2);
          color: #00ff00;
        }
        
        .post-status.failed {
          background: rgba(255, 107, 107, 0.2);
          color: #ff6b6b;
        }
        
        .post-content {
          flex: 1;
        }
        
        .post-content h4 {
          margin: 0 0 var(--spacing-xs) 0;
          color: var(--text-primary);
          font-size: 14px;
        }
        
        .post-content p {
          margin: 0 0 var(--spacing-sm) 0;
          color: var(--text-secondary);
          font-size: 12px;
          line-height: 1.4;
        }
        
        .post-platforms {
          display: flex;
          gap: var(--spacing-xs);
        }
        
        .platform-tag {
          padding: 2px var(--spacing-xs);
          background: rgba(0, 255, 231, 0.2);
          border: 1px solid rgba(0, 255, 231, 0.4);
          border-radius: var(--border-radius-sm);
          font-size: 10px;
          color: var(--accent-primary);
        }
        
        @media (max-width: 768px) {
          .calendar-view {
            padding: var(--spacing-md);
          }
          
          .calendar-view__header {
            flex-direction: column;
            gap: var(--spacing-md);
            align-items: flex-start;
          }
          
          .calendar-day {
            min-height: 80px;
          }
          
          .selected-date-posts {
            padding: var(--spacing-md);
          }
        }
      `}</style>
    </div>
  );
}