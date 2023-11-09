class HistoryPage {
  historyList = [];
  selectedYear = null;

  listWrapElem = null;
  tabWrapElem = null;

  changedIdx = null;

  get yearList() {
    return Array.from(
      new Set(this.historyList.map((v) => new Date(v.date).getFullYear()))
    );
  }

  init() {
    this.listWrapElem = $(".history-list")[0];
    this.tabWrapElem = $(".tab")[0];

    this.setEvent();
    this.load();
    this.render();
  }

  setEvent() {
    $("#insert-form").on("submit", (e) => {
      e.preventDefault();

      let title = e.target[0].value;
      let date = e.target[1].value;

      e.target[0].value = '';
      e.target[1].value = '';

      this.historyList.push({ title, date });
      this.render();
      this.save();

      $("#insert-form").modal("hide");
    });

    $("#update-form").on("submit", (e) => {
      e.preventDefault();

      let title = e.target[0].value;
      let date = e.target[1].value;
      this.historyList[this.changedIdx] = {
        title,
        date,
      };
      this.render();
      this.save();

      $("#update-form").modal("hide");
    });

    $("#remove-confirm .btn-confirm").on("click", () => {
      this.historyList.splice(this.changedIdx, 1);
      this.render();
      this.save();
    });
  }

  render() {
    // 초기화
    this.listWrapElem.innerHTML = ``;
    // 렌더링
    this.historyList
      .filter((item) => this.selectedYear === new Date(item.date).getFullYear())
      .forEach((historyItem, i) => {
        let date = new Date(historyItem.date);
        let dateText = `${String(date.getMonth() + 1).padStart(
          2,
          "0"
        )}. ${String(date.getDate()).padStart(2, "0")}.`;
        let elem = $(`<div class="history-list__item">
          <div class="date">${dateText}</div>
          <div class="title">${historyItem.title}</div>
          <div class="button-wrap">
            <button class="btn-edit" data-target="#update-form" data-toggle="modal">수정</button>
            <button class="btn-remove" data-target="#remove-confirm" data-toggle="modal">삭제</button>
          </div>
        </div>`)[0];

        elem.querySelector(".btn-edit").addEventListener("click", () => {
          this.changedIdx = i;
          $("#update-form").modal("show");
          $("#update-form .title").val(historyItem.title);
          $("#update-form .date").val(historyItem.date);
        });

        elem.querySelector(".btn-remove").addEventListener("click", () => {
          this.changedIdx = i;
        });

        this.listWrapElem.append(elem);
      });

    // 초기화
    this.tabWrapElem.innerHTML = "";
    // 렌더링
    this.yearList.forEach((year) => {
      let elem = $(`
        <div 
          class="tab__item ${this.selectedYear === year ? "selected" : ""}"
        >
        ${year}년
        </div>
      `)[0];
      this.tabWrapElem.addEventListener("click", (e) => {
        this.selectedYear = parseInt(e.target.innerText);
        this.render();
        this.save();
      });
      this.tabWrapElem.append(elem);
    });

    $('.content h3').text(this.selectedYear + '년');
  }

  save() {
    localStorage.setItem("historyList", JSON.stringify(this.historyList));
    localStorage.setItem("selectedYear", this.selectedYear);
  }

  load() {
    let savedData = localStorage.getItem("historyList");
    if (!savedData) return;
    this.historyList = JSON.parse(savedData);
    this.selectedYear = parseInt(localStorage.getItem("selectedYear"));
  }
}

window.addEventListener("load", () => {
  const app = new HistoryPage();
  app.init();
});
