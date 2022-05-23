(() => {
  var __defProp = Object.defineProperty;
  var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

  // kanovel.ts
  function kanovel(k) {
    k.scene("vn", () => {
      layers(["backgrounds", "characters", "textbox"]);
      const textboxBG = add([
        sprite("textbox"),
        k.origin("bot"),
        layer("textbox"),
        z(0),
        pos(width() / 2, height() - 20),
        {
          isWriting: false
        }
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
      chapters: /* @__PURE__ */ new Map(),
      characters: /* @__PURE__ */ new Map(),
      curDialog: "",
      curChapter: "start",
      curEvent: 0,
      character(id, name, sprite2) {
        return this.characters.set(id, {
          name,
          sprite: sprite2
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
      show(charId) {
        return () => this.showChar(this.characters.get(charId));
      },
      bg(sprite2) {
        return () => this.changeBackground(sprite2);
      },
      write(char, dialog) {
        if (char)
          this.namebox.text = char.name;
        else
          this.namebox.text = "";
        this.textbox.text = "";
        this.curDialog = dialog;
        for (let i = 0; i < dialog.length; i++) {
          wait(0.05 * i, () => this.textbox.text += dialog[i]);
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
      showChar(char) {
        add([
          sprite(char.sprite),
          k.origin("center"),
          pos(center()),
          layer("characters")
        ]);
      },
      changeBackground(spr) {
        every("background", (bg2) => {
          bg2.use(lifespan(1, { fade: 0.5 }));
        });
        const bg = add([
          sprite(spr),
          k.origin("center"),
          z(0),
          pos(center()),
          layer("backgrounds"),
          "background"
        ]);
        bg.use(z(0));
      },
      changeChapter(chapter) {
        if (!this.chapters.get(chapter)) {
          throw new Error(`"${chapter} chapter don't exists!"`);
        }
        this.curChapter = chapter;
        this.curEvent = 0;
        this.passDialogue();
      }
    };
  }
  __name(kanovel, "kanovel");
})();
//# sourceMappingURL=kanovel.js.map
