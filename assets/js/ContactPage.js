class ContactPage {
  phoneList = [];
  selectedDepth = "전체";
  tabWrapElem = null;
  listWrapElem = null;

  get depthList() {
    return Array.from(new Set(this.phoneList.map((v) => v.deptNm)));
  }

  get phoneGroupMap() {
    return this.depthList.map((depth) => {
      return {
        title: depth,
        list: this.phoneList.filter((item) => item.deptNm === depth),
      };
    });
  }

  async init() {
    this.tabWrapElem = $(".tab")[0];
    this.listWrapElem = $(".contact-wrap")[0];

    await this.fetchData();
    this.render();
  }

  async fetchData() {
    const res = await fetch("/restAPI/phone.php").then((res) => res.json());

    if (res.statusCd !== "200") {
      alert("오류가 발생했습니다. 메인 페이지로 돌아갑니다.");
      return;
    }

    this.phoneList = res.items;
  }

  render() {
    this.tabWrapElem.innerHTML = "";
    ["전체", ...this.depthList].forEach((depth) => {
      console.log(this.selectedDepth, depth);
      const tabElem = $(
        `<div class="tab__item ${
          this.selectedDepth === depth ? "selected" : ""
        }">${depth}</div>`
      )[0];
      tabElem.addEventListener("click", (e) => {
        this.selectedDepth = e.target.innerText;
        this.render();
      });

      this.tabWrapElem.append(tabElem);
    });

    this.listWrapElem.innerHTML = "";
    this.phoneGroupMap
      .filter(
        (item) =>
          this.selectedDepth === "전체" || item.title === this.selectedDepth
      )
      .forEach((mapItem) => {
        let itemElem = $(`<div class="contact-item">
        <h4>${mapItem.title}</h4>
        <div class="phone-list">
          ${mapItem.list
            .map(
              (item) => `
            <div class="phone-list__item">
              <div class="name">${item.name}</div>
              <div class="phone">${item.telNo}</div>
            </div>
            `
            )
            .join("")}
        </div>
      </div>`)[0];
        this.listWrapElem.append(itemElem);
      });
  }
}

window.addEventListener("load", () => {
  const app = new ContactPage();
  app.init();
});
