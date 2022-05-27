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
    k.scene("vn", (data) => {
      k.layers(["backgrounds", "characters", "textbox"]);
      const textboxBG = k.add([
        k.sprite("textbox"),
        k.origin("bot"),
        k.layer("textbox"),
        k.z(0),
        k.pos(k.width() / 2, k.height() - 20)
      ]);
      onLoad(() => {
        this.textbox = add([
          text("", { size: 30, width: textboxBG.width - 50 }),
          layer("textbox"),
          z(1),
          pos(textboxBG.pos.sub(textboxBG.width / 2 - 50, textboxBG.height - 30))
        ]);
        this.namebox = add([
          text("", { size: 40 }),
          layer("textbox"),
          z(2),
          pos(textboxBG.pos.sub(textboxBG.width / 2 - 30, textboxBG.height + 30))
        ]);
        this.passDialogue();
      });
      onUpdate(() => {
        if (isMousePressed() || isKeyPressed("space")) {
          this.passDialogue();
        }
      });
    });
    return {
      characters: /* @__PURE__ */ new Map(),
      chapters: /* @__PURE__ */ new Map(),
      curDialog: "",
      curChapter: "start",
      curEvent: 0,
      kanovel() {
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
      jump(chapter) {
        return () => this.changeChapter(chapter);
      },
      prota(dialog) {
        return () => this.write("", dialog);
      },
      char(id, dialog) {
        return () => this.write(this.characters.get(id), dialog);
      },
      show(charId, align) {
        return () => this.showChar(this.characters.get(charId), align);
      },
      bg(sprite) {
        return () => this.changeBackground(sprite);
      },
      write(char, dialog) {
        this.textbox.text = "";
        if (char) {
          this.namebox.text = char.name;
          this.curDialog = '"' + dialog + '"';
        } else {
          this.namebox.text = "";
          this.curDialog = dialog;
        }
        for (let i = 0; i < this.curDialog.length; i++) {
          wait(0.05 * i, () => this.textbox.text += this.curDialog[i]);
        }
      },
      checkAction(action) {
        if (action.length) {
          for (const act of action)
            this.checkAction(act);
        } else {
          action();
        }
      },
      passDialogue() {
        if (this.textbox.text !== this.curDialog)
          return;
        this.checkAction(this.chapters.get(this.curChapter)[this.curEvent]);
        this.curEvent++;
      },
      showChar(char, align) {
        let charPos = k.vec2(0, 0);
        if (align === "center")
          charPos = k.center();
        else if (align === "left")
          charPos = k.vec2(k.width() / 4, k.height() / 2);
        else if (align === "right")
          charPos = k.vec2(k.width() / 2 + k.width() / 4, k.height() / 2);
        else
          charPos = k.center();
        k.add([
          k.sprite(char.sprite),
          k.origin("center"),
          k.pos(charPos),
          k.layer("characters"),
          k.opacity(0),
          fade()
        ]);
      },
      changeBackground(spr) {
        k.every("bg", (bg2) => {
          bg2.use(k.lifespan(1, { fade: 0.5 }));
        });
        const bg = k.add([
          k.sprite(spr),
          k.opacity(0),
          k.origin("center"),
          k.pos(k.center()),
          k.z(0),
          k.layer("backgrounds"),
          "bg",
          fade()
        ]);
        bg.use(z(0));
      },
      changeChapter(chapter) {
        if (!this.chapters.get(chapter))
          throw new Error(`"${chapter} chapter don't exists!"`);
        this.curChapter = chapter;
        this.curEvent = 0;
        this.passDialogue();
      }
    };
  }
  __name(kanovelPlugin, "kanovelPlugin");
})();
//# sourceMappingURL=kanovel.js.map
