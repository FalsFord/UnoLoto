import React, { useState, useEffect } from 'react';
import './UnoGame.css';
import { useNavigate } from 'react-router-dom';

const Header = ({ onBuyTicket, ticketSetsCount,  balance,   onShowWinning, onShowWinnings }) => {
    const [isSupportHovered, setIsSupportHovered] = useState(false);
  const [isProfileHovered, setIsProfileHovered] = useState(false);
    const navigate = useNavigate();
  return (
    <header className="header-container">
      <div className="logo">
        <span className="logo-uno">UNO</span>
        <span className="logo-lottery">LOTTERY</span>
      </div>

      <nav className="nav-menu">
        <div className="menu-item" onClick={onShowWinning}>
          <span className="menu-icon winning-combination-button">🎫</span>
          Проверка билета
        </div>
        <div 
          className="menu-item"
          onMouseEnter={() => setIsSupportHovered(true)}
          onMouseLeave={() => setIsSupportHovered(false)}
        >
          <span className="menu-icon">🛟</span>
          Поддержка
          {isSupportHovered && (
            <div className="dropdown">
              <div className="dropdown-item">❓ Частые вопросы</div>
              <div className="dropdown-item">📩 Обратная связь</div>
              <div className="dropdown-item">💬 Чат поддержки</div>
            </div>
          )}
        </div>
      </nav>

      <div className="right-section">
        <button 
          className="buy-button" 
          onClick={onBuyTicket}
          disabled={ticketSetsCount === 4}
        >
          🎟️ Купить билет ({ticketSetsCount}/4)
        </button>
        <div className="currency-box">
          <span>DP</span>
          <span className="currency-symbol">{balance}</span>
        </div>
        <div 
        className="profile-button"
        onMouseEnter={() => setIsProfileHovered(true)}
        onMouseLeave={() => setIsProfileHovered(false)}
      >
        👤 Личный кабинет
        {isProfileHovered && (
          <div className="profile-dropdown">
              <div className="dropdown-item" onClick={() => navigate('/game')} > 🎮 Играть </div>
            <div className="dropdown-item" onClick={onShowWinnings}>🏆 Мои выигрыши</div>
            <div className="dropdown-item">🚪 Выйти</div>
          </div>
        )}
      </div>
      </div>
    </header>
  );
};
    
const UnoCard = ({ number, color, size = 'medium' }) => {
  const sizeMap = {
    small: { width: 56, height: 84 },
    medium: { width: 70, height: 105 },
    large: { width: 84, height: 126 }
  };

  const colorMap = {
    blue: '#1E90FF',
    yellow: '#FFD700',
    red: '#FF4500',
    green: '#32CD32',
    black: '#1a1a1a'
  };

  return (
    <div 
      className="uno-card" 
      style={{ 
        backgroundColor: colorMap[color],
        width: `${sizeMap[size].width}px`,
        height: `${sizeMap[size].height}px`
      }}
    >
      <div className="card-center">
        <div className="card-number">{number}</div>
      </div>
      <div className="card-corners">
        <div className="corner top-left">{number}</div>
        <div className="corner bottom-right">{number}</div>
      </div>
    </div>
  );
};

const TicketSet = ({ tickets, index }) => { 
  return (
    <div className="ticket-set">
      <div className="ticket-set-header">
        <h4>
          <span className="set-number">#{index + 1}</span>
          <span className="set-title">Набор билетов UNO</span>
        </h4>
      </div>
      <div className="ticket-set-cards">
        {tickets.map((ticket, i) => (
          <UnoCard key={i} number={ticket.number} color={ticket.color} />
        ))}
      </div>
      <div className="ticket-set-footer">
        <div className="set-price">💰 Стоимость 150 DP</div>
      </div>
    </div>
  );
};

const TicketPurchaseModal = ({ onClose, onAddTicketSet }) => {
  const [selectedNumber, setSelectedNumber] = useState(0);
  const [selectedColor, setSelectedColor] = useState('red');
  const [tickets, setTickets] = useState([]);
  const [animation, setAnimation] = useState('');

  const handleAddTicket = () => {
    if (tickets.length < 3) {
      const newTicket = { number: selectedNumber, color: selectedColor };
      setTickets([...tickets, newTicket]);
      setAnimation('bounce');
      setTimeout(() => setAnimation(''), 500);
    }
  };

  const handleSubmit = () => {
    if (tickets.length === 3) {
      onAddTicketSet(tickets);
      setTickets([]);
      onClose();
    }
  };

  const handleRemoveTicket = (index) => {
    const newTickets = [...tickets];
    newTickets.splice(index, 1);
    setTickets(newTickets);
  };

  const colors = [
    { name: 'red', label: 'Красный', emoji: '🔴' },
    { name: 'blue', label: 'Синий', emoji: '🔵' },
    { name: 'yellow', label: 'Желтый', emoji: '🟡' },
    { name: 'green', label: 'Зеленый', emoji: '🟢' }
  ];
 
  
  return (
    <div className="modal-overlay">
      <div className="modal-content small-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Создать набор билетов UNO</h3>
          <p className="modal-subtitle">Выберите 3 карты для набора</p>
          <button className="close-modal-button" onClick={onClose}>
            ×
          </button>
        </div>
        
        <div className={`ticket-slots ${animation}`}>
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="ticket-slot">
              {tickets[i] ? (
                <div className="ticket-with-remove">
                  <UnoCard number={tickets[i].number} color={tickets[i].color} size="small" />
                  <button 
                    className="remove-ticket-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveTicket(i);
                    }}
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div className="empty-slot">
                  <div className="empty-slot-icon">+</div>
                  <div className="empty-slot-label">Карта {i+1}</div>
                </div>
              )}
            </div>
          ))}
        </div>

        {tickets.length < 3 && (
          <div className="selection-panel">
            <div className="selection-grid">
              <div className="number-selection">
                <label className="selection-label">Выберите номер</label>
                <div className="number-buttons">
                  {Array(10).fill(0).map((_, i) => (
                    <button
                      key={i}
                      className={`number-button ${selectedNumber === i ? 'selected' : ''}`}
                      onClick={() => setSelectedNumber(i)}
                    >
                      {i}
                    </button>
                  ))}
                </div>
              </div>

              <div className="color-selection">
                <label className="selection-label">Выберите цвет</label>
                <div className="color-buttons">
                  {colors.map(color => (
                    <button
                      key={color.name}
                      className={`color-button ${selectedColor === color.name ? 'selected' : ''}`}
                      style={{ '--color': color.name }}
                      onClick={() => setSelectedColor(color.name)}
                    >
                      <span className="color-emoji">{color.emoji}</span>
                      {color.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button className="add-button" onClick={handleAddTicket}>
              🃏 Добавить карту
            </button>
          </div>
        )}
        
        <div className="modal-actions">
          <button 
            className="submit-button" 
            onClick={handleSubmit}
            disabled={tickets.length !== 3}
          >
            🎉 Создать набор ({tickets.length}/3)
          </button>
          <button className="close-button" onClick={onClose}>
            Отмена
          </button>
        </div>
      </div>
    </div>
  );
};
const MyWinningsModal = ({ onClose, ticketSets, winningCombination }) => {
  
  const checkMatches = (ticket) => {
    let fullMatches = 0;
    let partialMatches = 0;
    let zeros = 0;

    ticket.tickets.forEach((card, index) => {
      if (card.number === winningCombination[index].number && 
          card.color === winningCombination[index].color) {
        fullMatches++;
      } else if (card.color === winningCombination[index].color) {
        partialMatches++;
      } else if (card.number === 0) {
        zeros++;
      }
    });

    return { fullMatches, partialMatches, zeros };
  };


 const determinePrize = (ticket) => {
  const { fullMatches, partialMatches, zeros } = checkMatches(ticket);
  

  if (fullMatches === 3) return { prize: "Джекпот", color: "gold" };
  if (fullMatches === 2 && (partialMatches + zeros) >= 1) return { prize: "Большой приз", color: "silver" };
  if (fullMatches === 1 && (partialMatches + zeros) >= 2) return { prize: "Средний приз", color: "bronze" };
  if (fullMatches === 1 && partialMatches === 1 && zeros === 1) return { prize: "Полумассовый приз", color: "blue" };
  if (partialMatches === 2 && zeros === 1) return { prize: "Массовый приз", color: "green" };
  
  return { prize: "Не выиграл", color: "gray" };
};

  return (
    <div className="modal-overlay">
      <div className="modal-content winnings-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Мои выигрыши</h3>
          <p className="modal-subtitle">Результаты проверки ваших билетов</p>
          <button className="close-modal-button" onClick={onClose}>
            ×
          </button>
        </div>
        
        <div className="winning-combination-section">
          <h4>Выигрышная комбинация:</h4>
          <div className="winning-combination">
            {winningCombination.map((card, index) => (
              <UnoCard key={index} number={card.number} color={card.color} size="small" />
            ))}
          </div>
        </div>
        
        <div className="winnings-list">
          {ticketSets.length > 0 ? (
            ticketSets.map((ticket, index) => {
              const { prize, color } = determinePrize(ticket);
              return (
                <div key={index} className={`ticket-result ${color}`}>
                  <div className="ticket-header">
                    <span className="ticket-number">Набор #{index + 1}</span>
                    <span className={`prize-badge ${color}`}>{prize}</span>
                  </div>
                  <div className="ticket-cards">
         {ticket.tickets.map((card, i) => {
            const isFullMatch = card.number === winningCombination[i].number && 
                      card.color === winningCombination[i].color;
         const isPartialMatch = !isFullMatch && card.color === winningCombination[i].color;
             const isZero = card.number === 0;
    
            return (
         <div key={i} className={`card-container ${
        isFullMatch ? 'full-match' : 
        isPartialMatch ? 'partial-match' : ''
              }`}>
        <UnoCard number={card.number} color={card.color} size="small" />
        <div className="match-indicator">
          {isFullMatch ? '✓' : isPartialMatch ? '~' : isZero ? '0' : ''}
        </div>
                </div>
                );
             })}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="no-tickets">
              У вас нет билетов для проверки
            </div>
          )}
        </div>
        
        <div className="modal-actions">
          <button className="close-button" onClick={onClose}>
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};
const WinningCombinationModal = ({ winningCombination, onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content small-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Выигрышная комбинация</h3>
          <p className="modal-subtitle">Результаты последнего розыгрыша</p>
          <button className="close-modal-button" onClick={onClose}>
            ×
          </button>
        </div>
        
        <div className="winning-combination">
          {winningCombination.map((card, index) => (
            <UnoCard key={index} number={card.number} color={card.color} size="medium" />
          ))}
        </div>
        
        <div className="modal-actions">
          <button className="close-button" onClick={onClose}>
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};

const RulesSection = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`rules-section ${expanded ? 'expanded' : ''}`}>
      <h3 className="rules-header" onClick={() => setExpanded(!expanded)}>
        {expanded ? '▼' : '▶'} Правила лотереи UNO
      </h3>
      {expanded && (
        <div className="rules-content">
          <div className="rule-item">
            <div className="rule-number">1</div>
            <p>Создайте набор из 3 карт UNO, выбирая номера (0-9) и цвета.</p>
          </div>
          <div className="rule-item">
            <div className="rule-number">2</div>
            <p>Максимальное количество наборов - 4.</p>
          </div>
          <div className="rule-item">
            <div className="rule-number">3</div>
            <p>Розыгрыш проводится каждые 15 минут.</p>
          </div>
          <div className="rule-item">
            <div className="rule-number">4</div>
            <p>Для выигрыша нужно угадать все 3 карты в правильном порядке.</p>
          </div>
        </div>
      )}
    </div>
  );
};

function UnoGame() {
  const [showModal, setShowModal] = useState(false);
  const [showWinningModal, setShowWinningModal] = useState(false);
  const [showWinningsModal, setShowWinningsModal] = useState(false);
  
  
  const [ticketSets, setTicketSets] = useState(() => {
    const saved = localStorage.getItem('ticketSets');
    return saved ? JSON.parse(saved) : [];
  });

  const [balance, setBalance] = useState(() => {
    const saved = localStorage.getItem('balance');
    return saved ? parseInt(saved) : 100000;
  });

  const [phaseEndTime, setPhaseEndTime] = useState(() => {
  // Устанавливаем фиксированное время: текущее время плюс 5 секунд
  return new Date(new Date().getTime() + 30 * 1000);
});

  const [isRevealPeriod, setIsRevealPeriod] = useState(() => {
    return localStorage.getItem('isRevealPeriod') === 'true';
  });

  const [currentWinningCombination, setCurrentWinningCombination] = useState(() => {
    const saved = localStorage.getItem('winningCombination');
    return saved ? JSON.parse(saved) : Array(3).fill({ number: 0, color: 'black' });
  });

  const [nextDraw, setNextDraw] = useState('');
   useEffect(() => {
    localStorage.setItem('ticketSets', JSON.stringify(ticketSets));
    localStorage.setItem('balance', balance.toString());
  }, [ticketSets, balance]);

 useEffect(() => {
  const timer = setInterval(async () => {
    const now = new Date();
    const diff = phaseEndTime - now;

    if (diff <= 0) {
      if (!isRevealPeriod) {
        const newCombo = Array.from({ length: 3 }, () => ({
          number: Math.floor(Math.random() * 10),
          color: ['red', 'blue', 'yellow', 'green'][Math.floor(Math.random() * 4)]
        }));

        setCurrentWinningCombination(newCombo);
        setIsRevealPeriod(true);
        const newEndTime = new Date(now.getTime() + 30 * 1000); // 0.5 секунды для демонстрации
        setPhaseEndTime(newEndTime);
      } else {
        try {
          await fetch('/api/game/reset', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            }
          });
        } catch (error) {
          console.error('Ошибка синхронизации:', error);
        }
        setTicketSets([]);
        setIsRevealPeriod(false);

        // Устанавливаем фиксированное время: текущее время плюс 5 секунд
        const nextDrawTime = new Date(now.getTime() + 30 * 1000);
        setPhaseEndTime(nextDrawTime);

        // Сброс выигрышной комбинации
        setCurrentWinningCombination(
          Array(3).fill({ number: 0, color: 'black' })
        );
      }
    } else {
      const seconds = Math.floor(diff / 1000);
      setNextDraw(`${seconds}с`);
    }
  }, 1000);

  

  const loadInitialBalance = async () => {
    try {
      const response = await fetch('/api/user/balance', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      const { balance } = await response.json();
      setBalance(balance);
      localStorage.setItem('balance', balance);
    } catch (error) {
      console.error('Ошибка загрузки баланса:', error);
      // Фолбэк на localStorage если бэкенд недоступен
      const savedBalance = localStorage.getItem('balance');
      if (savedBalance) setBalance(parseInt(savedBalance));
      // const savedBalance = localStorage.getItem('balance');
      // if (savedBalance) setBalance(parseInt(100000));
    }
  };

  loadInitialBalance();
return () => clearInterval(timer);
}, [phaseEndTime, isRevealPeriod]);

const sendToBackend = (ticketData) => {
  const userEmail = localStorage.getItem('userEmail');
  const requestBody = {
    ticketSets: [ticketData.tickets.map(card => ({
      number: card.number,
      color: card.color
    }))],
    timestamp: new Date().toISOString(),
    totalSets: 1,
    user_email: "admin@admin.com"
  };
  console.log('Отправляемые данные:', JSON.stringify(requestBody, null, 2));
  fetch('http://81.94.158.193:8000/unogame', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
      // 'Authorization': `Bearer ${localStorage.getItem('authToken')}`
    },
    body: JSON.stringify(requestBody),
  })
  .then(response => {
    if (!response.ok) {
      return response.json().then(err => {
        throw new Error(`HTTP error ${response.status}: ${JSON.stringify(err)}`);
      });
    }
    return response.json();
  })
  .then(data => console.log('Успешная отправка', data))
  .catch(error => {
    console.error('Ошибка:', error);
  });
}; 

  const handleBuyTicket = () => {
    if (ticketSets.length < 4) {
      setShowModal(true);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleAddTicketSet = (tickets) => {
    const newTicketSet = {
      tickets,
      currency: 'DP',
      timestamp: new Date().toISOString()
    };

    setTicketSets([...ticketSets, newTicketSet]);
    setBalance(prev => prev - 150);
    sendToBackend(newTicketSet);
    // console.log("Response");
    // console.log(response_result);
    // alert(response_result);
    
  };



  return (
     <div className="App">
      <Header 
    onBuyTicket={handleBuyTicket} 
    ticketSetsCount={ticketSets.length}
      balance={balance}
     onShowWinning={() => setShowWinningModal(true)} 
     onShowWinnings={() => setShowWinningsModal(true)} 
    />
      
      <div className="next-draw-banner">
        <div className="next-draw">
          ⏳ Следующий розыгрыш через {nextDraw}
        </div>
      </div>
      
      <main className="game-container">
        <div className="ticket-sets-container">
          {ticketSets.length > 0 ? (
            <div className="ticket-sets-grid">
              {ticketSets.map((set, index) => (
                <TicketSet 
                  key={index}
                  tickets={set.tickets}
                  index={index}
             
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-cards">
                <UnoCard number={0} color="black" size="large" />
                <UnoCard number={0} color="black" size="large" />
                <UnoCard number={0} color="black" size="large" />
              </div>
              <h3>У вас пока нет наборов билетов</h3>
              <p>Создайте свой первый набор из 3 карт UNO для участия в розыгрыше</p>
              <button className="cta-button" onClick={handleBuyTicket}>
                🎟️ Создать первый набор
              </button>
            </div>
          )}
        </div>
        
        <RulesSection />
      </main>

      {showModal && (
        <TicketPurchaseModal 
          onClose={handleCloseModal} 
          onAddTicketSet={handleAddTicketSet}
        />
      )}
      
    {showWinningsModal && (
  <MyWinningsModal 
    onClose={() => setShowWinningsModal(false)}
    ticketSets={ticketSets}
    winningCombination={currentWinningCombination}
    isRevealPeriod={isRevealPeriod}
  />
)}
{showWinningModal && (
  <WinningCombinationModal 
    winningCombination={currentWinningCombination}
    onClose={() => setShowWinningModal(false)}
    isRevealPeriod={isRevealPeriod}
  />
)}
      
      <footer className="game-footer">
        <div className="footer-content">
          <div className="footer-links">
            <a href="#terms">Условия использования</a>
            <a href="#privacy">Политика конфиденциальности</a>
            <a href="#responsible">Ответственная игра</a>
          </div>
          <div className="footer-copyright">
            © 2025 UNO LOTTERY. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default UnoGame;