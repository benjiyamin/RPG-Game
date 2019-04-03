function Fighter(healthPoints, attackPower, counterPower, opts = {}) {
  this.healthPoints = healthPoints
  this.maxHealthPoints = healthPoints
  this.attackPower = attackPower
  this.counterPower = counterPower
  this.opts = opts

  this.healthPercentage = function () {
    return Math.round(this.healthPoints / this.maxHealthPoints * 100)
  }

  this.attack = function (enemy) {
    // Attack the defender
    enemy.healthPoints -= this.attackPower
    if (enemy.isAlive()) {
      // Counter strike
      enemy.counter(this)
    }
    this.attackPower += 6
  }

  this.counter = function (enemy) {
    enemy.healthPoints -= this.counterPower
  }

  this.isAlive = function () {
    if (this.healthPoints > 0) {
      return true
    } else {
      return false
    }
  }
}

function Game() {
  this.startFighters = []
  this.fighters = []
  this.defeated = []
  this.defender = undefined
  this.attacker = undefined

  this.newGame = function () {
    this.defender = undefined
    this.attacker = undefined
    this.defeated = []
    this.fighters = []
    this.startFighters.forEach(sFighter => {
      let fighter = new Fighter(sFighter.healthPoints, sFighter.attackPower, sFighter.counterPower, sFighter.opts)
      this.fighters.push(fighter)
    });
  }

  this.queued = function () {
    let output = []
    this.fighters.forEach(fighter => {
      if (fighter !== this.attacker && fighter !== this.defender && this.defeated.indexOf(fighter) === -1) {
        output.push(fighter)
      }
    });
    return output
  }

  this.createFighter = function (healthPoints, attackPower, counterPower, opts = {}) {
    let fighter = new Fighter(healthPoints, attackPower, counterPower, opts)
    this.fighters.push(fighter)
    this.startFighters.push(new Fighter(healthPoints, attackPower, counterPower, opts))
    return fighter
  }

  this.pickAttacker = function (fighter) {
    if (this.fighters.indexOf(fighter) !== -1) {
      this.attacker = fighter
      return fighter
    } else {
      throw 'Not an valid fighter'
    }
  }

  this.pickDefender = function (fighter) {
    if (this.fighters.indexOf(fighter) !== -1) {
      this.defender = fighter
      return fighter
    } else {
      throw 'Not an valid fighter'
    }
  }

  this.attack = function () {
    if (this.attacker && this.defender) {
      this.attacker.attack(this.defender)
      if (!this.defender.isAlive()) {
        // Enemy is killed
        this.defeated.push(this.defender)
        this.defender = undefined
      } else if (!this.attacker.isAlive()) {
        // Player is killed
        this.attacker = undefined
      }
    } else {
      throw 'Defender and Attacker have not been selected'
    }
  }

  this.won = function () {
    return this.attacker && !this.defender && this.defeated.length > this.fighters.length - 2
  }

  this.lost = function () {
    return !this.attacker && this.defender
  }

  this.gameOver = function () {
    return win() || lost()
  }

}