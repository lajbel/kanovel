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
    function write(dialog, character) {
      return __async(this, null, function* () {
        this.skip = false;
        this.textbox.text = "";
        let curCh = 0;
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
        k.layer("characters"),
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
        k.z(0),
        k.layer("backgrounds"),
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
      if (this.textbox.text !== this.curDialog)
        return skipText();
      this.curEvent++;
      runEvent(this.chapters.get(this.curChapter)[this.curEvent]);
    }
    __name(nextEvent, "nextEvent");
    function runEvent(event) {
      if (event.length) {
        for (const e of event)
          this.runEvent(e);
      } else {
        event();
      }
    }
    __name(runEvent, "runEvent");
    k.scene("vn", (data) => {
      var _a;
      let textboxBG;
      k.layers(["backgrounds", "characters", "textbox"]);
      if ((_a = config.textbox) == null ? void 0 : _a.sprite) {
        textboxBG = k.add([
          k.sprite("textbox"),
          k.origin("bot"),
          k.layer("textbox"),
          k.z(0),
          k.pos(k.width() / 2, k.height() - 20)
        ]);
      } else {
        textboxBG = k.add([
          k.rect(config.width || k.width(), config.height || k.height() / 4),
          k.origin("bot"),
          k.layer("textbox"),
          k.z(0),
          k.pos(k.width() / 2, k.height() - 20)
        ]);
      }
      k.onLoad(() => {
        this.textbox = k.add([
          k.text("", {
            size: 30,
            width: textboxBG.width - 70
          }),
          k.layer("textbox"),
          k.z(1),
          k.pos(textboxBG.pos.sub(textboxBG.width / 2 - 50, textboxBG.height - 30))
        ]);
        this.namebox = k.add([
          k.text("", { size: 40 }),
          k.layer("textbox"),
          k.z(2),
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
        return () => write(dialog);
      },
      char(id, dialog) {
        return () => write(dialog, this.characters.get(id));
      },
      show(charId, align = "center") {
        return () => showCharacter(this.characters.get(charId), align);
      },
      bg(sprite) {
        return () => changeBackground(sprite);
      },
      jump(chapter) {
        return () => changeChapter(chapter);
      },
      music(song) {
        return () => playBGMusic(song);
      },
      burpy(endScene = "end") {
        return () => {
          k.burp();
          this.curPlaying.forEach((a) => a.stop());
          k.go(endScene);
        };
      }
    };
  }
  __name(kanovelPlugin, "kanovelPlugin");
})();
//# sourceMappingURL=kanovel.js.map
