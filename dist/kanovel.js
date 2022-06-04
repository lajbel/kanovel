(() => {
  var __defProp = Object.defineProperty;
  var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
  var __async = (__this, __arguments, generator) => {
    return new Promise((resolve, reject) => {
      var fulfilled = (value) => {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      };
      var rejected = (value) => {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      };
      var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
      step((generator = generator.apply(__this, __arguments)).next());
    });
  };

  // code/kanovel.ts
  function fade() {
    let lastTime = 0;
    return {
      id: "fade",
      require: ["opacity"],
      update() {
        if (this.opacity < 1 && time() > lastTime) {
          lastTime = time() + 0.01;
          this.opacity += 0.025;
        }
      }
    };
  }
  __name(fade, "fade");
  function kanovelPlugin(k) {
    let config;
    const layers = {
      bg: 0,
      chars: 1,
      textbox: 2,
      text: 3,
      name: 4,
      choices: 5
    };
    function write(dialog, character) {
      return __async(this, null, function* () {
        this.skip = false;
        this.textbox.text = "";
        if (character) {
          this.namebox.text = character.name;
          this.curDialog = '"' + dialog + '"';
        } else {
          this.namebox.text = "";
          this.curDialog = dialog;
        }
        for (let i = 0; i < this.curDialog.length; i++) {
          if (this.skip)
            break;
          yield k.wait(0.05, () => {
            if (this.skip)
              return;
            this.textbox.text += this.curDialog[i];
          });
        }
      });
    }
    __name(write, "write");
    function skipText() {
      this.skip = true;
      this.textbox.text = this.curDialog;
    }
    __name(skipText, "skipText");
    ;
    function addChoices(choices) {
      var _a, _b;
      const basePos = k.vec2(k.width() / 2, k.height() / 4);
      let lastChoice;
      for (let i = 0; i < choices.length; i++) {
        lastChoice = k.add([
          ((_a = config.choice) == null ? void 0 : _a.sprite) ? k.sprite((_b = config.choice) == null ? void 0 : _b.sprite) : k.rect(k.width() - 40, k.height() / 8),
          k.origin("center"),
          k.pos(lastChoice ? lastChoice.pos.add(0, basePos.y) : basePos.clone()),
          k.z(layers.choices),
          k.area(),
          "choice",
          {
            choice: i
          }
        ]);
        k.add([
          k.text(choices[i][0]),
          k.origin("center"),
          k.pos(lastChoice.pos.clone()),
          k.z(layers.choices),
          "choiceText"
        ]);
        const cancelChoice = k.onUpdate("choice", (c) => {
          if (c.isClicked()) {
            k.every("choice", k.destroy);
            k.every("choiceText", k.destroy);
            checkChoice(choices[c.choice]);
            return cancelChoice();
          }
        });
      }
    }
    __name(addChoices, "addChoices");
    ;
    function checkChoice(choice) {
      runEvent(choice[1]);
    }
    __name(checkChoice, "checkChoice");
    ;
    function showCharacter(char, align = "center") {
      nextEvent();
      let charPos = k.vec2(0, 0);
      if (align === "center")
        charPos = k.center();
      else if (align === "left")
        charPos = k.vec2(k.width() / 4, k.height() / 2);
      else if (align === "right")
        charPos = k.vec2(k.width() / 2 + k.width() / 4, k.height() / 2);
      k.add([
        k.sprite(char.sprite),
        k.opacity(0),
        k.origin("center"),
        k.pos(charPos),
        k.z(layers.chars),
        fade()
      ]);
    }
    __name(showCharacter, "showCharacter");
    function changeBackground(spr) {
      nextEvent();
      k.every("bg", (bg) => {
        bg.use(k.lifespan(1, { fade: 0.5 }));
      });
      k.add([
        k.sprite(spr),
        k.opacity(0),
        k.origin("center"),
        k.pos(k.center()),
        k.z(layers.bg),
        "bg",
        fade()
      ]);
    }
    __name(changeBackground, "changeBackground");
    function changeChapter(chapter) {
      if (!this.chapters.get(chapter))
        throw new Error(`"${chapter} chapter don't exists!"`);
      this.curChapter = chapter;
      this.curEvent = -1;
      nextEvent();
    }
    __name(changeChapter, "changeChapter");
    function playBGMusic(song) {
      nextEvent();
      const bgm = k.play(song, { loop: true });
      this.curPlaying.push(bgm);
    }
    __name(playBGMusic, "playBGMusic");
    function nextEvent() {
      if (k.get("choice").length)
        return;
      if (this.textbox.text !== this.curDialog)
        return skipText();
      this.curEvent++;
      runEvent(this.chapters.get(this.curChapter)[this.curEvent], this.chapters.get(this.curChapter)[this.curEvent + 1]);
    }
    __name(nextEvent, "nextEvent");
    function runEvent(event, next) {
      return __async(this, null, function* () {
        if (event.length) {
          for (const e of event)
            runEvent(e, this.chapters.get(this.curChapter)[this.curEvent + 1]);
        } else {
          yield event.exe();
          if ((next == null ? void 0 : next.id) === "choice")
            nextEvent();
        }
        console.log(event.id, next.id);
      });
    }
    __name(runEvent, "runEvent");
    k.scene("vn", (data) => {
      var _a;
      let textboxBG;
      if ((_a = config.textbox) == null ? void 0 : _a.sprite) {
        textboxBG = k.add([
          k.sprite("textbox"),
          k.origin("bot"),
          k.z(layers.textbox),
          k.pos(k.width() / 2, k.height() - 20)
        ]);
      } else {
        textboxBG = k.add([
          k.rect(config.width || k.width(), config.height || k.height() / 4),
          k.origin("bot"),
          k.z(layers.textbox),
          k.pos(k.width() / 2, k.height() - 20)
        ]);
      }
      k.onLoad(() => {
        this.textbox = k.add([
          k.text("", {
            size: 30,
            width: textboxBG.width - 70
          }),
          k.z(layers.text),
          k.pos(textboxBG.pos.sub(textboxBG.width / 2 - 50, textboxBG.height - 30))
        ]);
        this.namebox = k.add([
          k.text("", { size: 40 }),
          k.z(layers.name),
          k.pos(textboxBG.pos.sub(textboxBG.width / 2 - 30, textboxBG.height + 30))
        ]);
        nextEvent();
      });
      k.onUpdate(() => {
        if (k.isMousePressed() || k.isKeyPressed("space")) {
          nextEvent();
        }
      });
    });
    return {
      characters: /* @__PURE__ */ new Map(),
      chapters: /* @__PURE__ */ new Map(),
      curDialog: "",
      curChapter: "start",
      curEvent: -1,
      curPlaying: [],
      skip: false,
      kanovel(c) {
        config = c;
      },
      character(id, name, sprite) {
        return this.characters.set(id, {
          name,
          sprite
        });
      },
      chapter(title, events) {
        if (this.chapters.get(title)) {
          throw new Error(`You can't repeat the chapter name! "${title}"`);
        }
        return this.chapters.set(title, events());
      },
      prota(dialog) {
        return {
          id: "prota",
          exe: () => write(dialog)
        };
      },
      narrator(dialog) {
        return {
          id: "narrator",
          exe: () => write(dialog)
        };
      },
      char(id, dialog) {
        return {
          id: "dialog",
          exe: () => write(dialog, this.characters.get(id))
        };
      },
      show(charId, align = "center") {
        return {
          id: "show",
          exe: () => showCharacter(this.characters.get(charId), align)
        };
      },
      choice(...choices) {
        return {
          id: "choice",
          exe: () => addChoices(choices)
        };
      },
      bg(sprite) {
        return {
          id: "bg",
          exe: () => changeBackground(sprite)
        };
      },
      jump(chapter) {
        return {
          id: "jump",
          exe: () => changeChapter(chapter)
        };
      },
      music(song) {
        return {
          id: "music",
          exe: () => playBGMusic(song)
        };
      },
      burpy(endScene = "end") {
        return {
          id: "burpy",
          exe: () => {
            k.burp();
            this.curPlaying.forEach((a) => a.stop());
            k.go(endScene);
          }
        };
      }
    };
  }
  __name(kanovelPlugin, "kanovelPlugin");
})();
//# sourceMappingURL=kanovel.js.map
