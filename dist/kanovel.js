(() => {
  var __defProp = Object.defineProperty;
  var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

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
    function write(dialog, char) {
      this.textbox.text = "";
      if (char) {
        this.namebox.text = char.name;
        this.curDialog = '"' + dialog + '"';
      } else {
        this.namebox.text = "";
        this.curDialog = dialog;
      }
      for (let i = 0; i < this.curDialog.length; i++) {
        k.wait(0.05 * i, () => this.textbox.text += this.curDialog[i]);
      }
    }
    __name(write, "write");
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
      k.play(song, { loop: true });
    }
    __name(playBGMusic, "playBGMusic");
    function nextEvent() {
      if (this.textbox.text !== this.curDialog)
        return;
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
      k.layers(["backgrounds", "characters", "textbox"]);
      const textboxBG = k.add([
        k.sprite("textbox"),
        k.origin("bot"),
        k.layer("textbox"),
        k.z(0),
        k.pos(k.width() / 2, k.height() - 20)
      ]);
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
      kanovel(config) {
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
      burpy() {
        return () => {
          k.burp();
        };
      }
    };
  }
  __name(kanovelPlugin, "kanovelPlugin");
})();
//# sourceMappingURL=kanovel.js.map
