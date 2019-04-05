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

      let cardImg = $('<img>', view)
        .addClass('card-img-top')
        .attr('src', fighter.opts.imgFront)
      let hpBadge = $('<p>', view)
        .addClass('badge badge-success')
        .text(fighter.healthPoints + ' hp')
      let cardTitle = $('<h6>', view)
        .addClass('card-title')
        .text(fighter.opts.name + ' ')
      let cardBody = $('<div>', view)
        .addClass('card-body text-center')
        .append(cardTitle)
        .append(hpBadge)
      let card = $('<div>', view)
        .addClass('card fighter-card shadow')
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
    this.renderAttacker()
    $('#welcome', view).hide()
    $('#arena', view).show()
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
    if (model.queued().length > 0) {
      model.fighters.forEach(fighter => {
        if (fighter !== model.attacker) {
          let fighterImg = $('<img>', view)
            .addClass('fighter-icon')
            .attr('src', fighter.opts.imgIcon)
            .on('click', function () {
              model.pickDefender(fighter)
              self.renderDefender()
              $('#btnAtk', view).attr('disabled', false)
            })
          if (model.queued().indexOf(fighter) === -1) {
            fighterImg.addClass('disabled')
          }
          $fighterIcons.append(fighterImg)
          //$enemies.show()
        }
      });
      $enemies.show()
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
    let $btnAtk = $('#btnAtk', view)
    if (!model.defender) {
      self.updateIcons()
      $('#cardDefender', view).hide()
      $('#btnAtk', view).attr('disabled', true)
      if (model.won()) {
        // User won
        console.log(this)
        $btnAtk.hide()
        self.displayWin()
      }
    } else if (!model.attacker) {
      // User Lost
      $('#cardAttacker', view).hide()
      $btnAtk.hide()
      $btnAtk.attr('disabled', true)
      self.displayLost()
    }
  })

  $('.btn-reset', view).on('click', function () {
    model.newGame()
    self.reset()
  })

}