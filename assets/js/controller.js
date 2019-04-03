function Controller(model, view) {
  var self = this

  // Initialize the game
  this.init = function () {
    this.initCards()
  }

  // Generate a list of fighters user can choose attacker from
  this.initCards = function () {
    let $fighterCards = $('#fighterCards', view)
      .empty()
    model.fighters.forEach(fighter => {

      let cardImg = $('<img>')
        .addClass('card-img-top')
        .attr('src', fighter.opts.imgIcon)
      let cardTitle = $('<h5>')
        .addClass('card-title')
        .text(fighter.opts.name)
      let cardBody = $('<div>')
        .addClass('card-body')
        .html(cardTitle)

      let card = $('<div>', view)
        .addClass('card fighter-card')
        .append(cardImg)
        .append(cardBody)
        .on('click', function () {
          model.pickAttacker(fighter)
          self.initArena()
        })
      $fighterCards.append(card)
    });
  }

  this.initArena = function () {
    $('#welcome', view).hide()
    $('#arena', view).show()
    this.renderAttacker()
    this.updateHealths()
    this.updateIcons()
  }

  // Attacker in location
  this.renderAttacker = function () {
    $('#nameAttacker', view).text(model.attacker.opts.name)
    $('#imgAttacker', view).attr('src', model.attacker.opts.imgBack)
  }

  // Generate a list of fighters user can choose defender from
  this.updateIcons = function () {
    let $enemies = $('#enemies', view)
    let $fighterIcons = $('#fighterIcons', view)
      .empty()
    if (model.fighters.length > 0) {
      model.queued().forEach(fighter => {
        let fighterImg = $('<img>', view)
          .addClass('fighter-icon')
          .attr('src', fighter.opts.imgIcon)
          .on('click', function () {
            model.pickDefender(fighter)
            self.renderDefender()
            $('#btnAtk', view).attr('disabled', false)
          })
        $fighterIcons.append(fighterImg)
        $enemies.show()
      });
    } else {
      $enemies.hide()
    }
  }

  // Defender in location
  this.renderDefender = function (hit = false) {
    let $wrapperDef = $('#wrapperDef', view)
    $wrapperDef.empty()
    if (model.defender) {
      $('#nameDefender', view).text(model.defender.opts.name)
      let $imgDefender = $('<img>')
        .addClass('w-100')
        .attr('src', model.defender.opts.imgFront)
      if (hit) {
        $imgDefender.addClass('flicker')
      } else {
        $('#cardDefender', view).show()
        $('#enemies', view).hide()
      }
      $wrapperDef.html($imgDefender)
    }
    this.updateHealth($('#progressDefender', view), model.defender)
  }

  // Health bar updates from fighter stats
  this.updateHealth = function (progressBar, fighter, showHp = false) {
    let percent = 0
    if (fighter) {
      percent = parseInt(fighter.healthPercentage())
    }
    let $progressBar = $(progressBar, view)
      .css('width', percent + '%')
    if (percent > 50) {
      $progressBar.attr('class', 'progress-bar bg-success')
    } else if (percent > 20) {
      $progressBar.attr('class', 'progress-bar bg-warning')
    } else {
      $progressBar.attr('class', 'progress-bar bg-danger')
    }
    if (showHp && fighter) {
      $progressBar.text(fighter.healthPoints + ' / ' + fighter.maxHealthPoints)
    }
  }

  // Update both attacker and desfender health at the same time
  this.updateHealths = function () {
    this.updateHealth($('#progressAttacker', view), model.attacker, showHp = true)
    this.updateHealth($('#progressDefender', view), model.defender)
  }

  this.displayWin = function () {
    $('#wrapperDef', view).hide()
    $('#wrapperWin', view).show()
  }

  this.displayLost = function () {
    $('#wrapperAtk', view).hide()
    $('#wrapperLost', view).show()
  }

  this.reset = function () {
    //this.initCards()
    $('#welcome', view).show()
    $('#arena', view).hide()
    this.initCards()
    $('.end-wrapper', view).hide()
    $('#wrapperDef', view)
      .show()
      .empty()
    $('#wrapperAtk', view).show()
    $('#cardDefender', view).hide()
    $('#cardAttacker', view).show()
    $('#btnAtk', view).show()
  }

  $('#btnAtk', view).on('click', function () {
    // Attack
    model.attack()
    self.renderDefender(hit = true)
    self.updateHealths()
    if (!model.defender) {
      self.updateIcons()
      $('#cardDefender', view).hide()
      $('#btnAtk', view).attr('disabled', true)
      if (model.won()) {
        // User won
        self.displayWin()
      }
    } else if (!model.attacker) {
      // User Lost
      $('#cardAttacker', view).hide()
      $('#btnAtk', view).hide()
      self.displayLost()
    }
  })

  $('.btn-reset', view).on('click', function () {
    model.newGame()
    self.reset()
  })

}