function parseXML(dataTxt) {
  const parser = new DOMParser();
  const data = parser.parseFromString(dataTxt, "text/xml");

  return $(data)
    .find("item")
    .map((i, v) => {
      let attrMap = Array.from(v.children).map((elem) => ({
        key: elem.tagName,
        value: elem.innerHTML.replace(/<!\[CDATA\[(.*)\]\]>/, (v1, v2) => v2),
      }));
      return attrMap.reduce(
        (acc, { key, value }) => ({ ...acc, [key]: value }),
        {}
      );
    })
    .toArray();
}

const CONTENT_CNT = 8;
const PAGE_CNT = 10;
class CulturePage {
  cultureList = [];
  statusElem = null;
  albumWrapElem = null;
  pagerWrapElem = null;

  currentPage = 1;
  get totalPage() {
    return Math.ceil(this.cultureList.length / CONTENT_CNT);
  }
  get startPage() {
    return Math.floor((this.currentPage - 1) / PAGE_CNT) * PAGE_CNT + 1;
  }
  get endPage() {
    return Math.min(this.startPage + PAGE_CNT - 1, this.totalPage);
  }

  async init() {
    this.statusElem = $(".page-status")[0];
    this.albumWrapElem = $(".album-wrap")[0];
    this.pagerWrapElem = $(".pager")[0];

    await this.fetchData();
    this.render();
    this.setEvent();
  }

  async fetchData() {
    const dataTxt = await fetch("/xml/nihList.xml").then((res) => res.text());
    let result = parseXML(dataTxt);

    this.cultureList = await Promise.all(
      result.map(async (v) => {
        const res = await fetch(
          `/xml/detail/${v.ccbaKdcd}_${v.ccbaCtcd}_${v.ccbaAsno}.xml`
        )
          .then((res) => res.text())
          .catch(() => "");
        return parseXML(res)[0];
      })
    );
  }

  render() {
    this.statusElem.innerText = `총 ${this.cultureList.length}건 ${this.currentPage}p / ${this.totalPage}p`;

    this.albumWrapElem.innerHTML = "";

    let startIdx = (this.currentPage - 1) * CONTENT_CNT;
    let endIdx = startIdx + CONTENT_CNT;
    this.cultureList.slice(startIdx, endIdx).forEach((item) => {
      const data = $(`<div class="album-item">
        <img src="/xml/nihcImage/${item.imageUrl}" alt="no image" />
        <div class="title">${item.ccbaMnm1}</div>
      </div>`)[0];
      this.albumWrapElem.append(data);
    });

    this.pagerWrapElem.innerHTML = "";
    for (let i = this.startPage; i <= this.endPage; i++) {
      let pageElem = $(`<div class="pager__item ${i === this.currentPage ? 'active' : ''}">
        ${i}
      </div>`)[0];
      pageElem.addEventListener("click", () => this.setPage(i));
      this.pagerWrapElem.append(pageElem);
    }
  }

  setEvent() {
    $(".page-start").on("click", () => {
      this.setPage(1);
    });

    $(".page-end").on("click", () => {
      this.setPage(this.totalPage);
    });

    $(".page-next").on("click", () => {
      this.setPage(Math.min(this.totalPage, this.currentPage + 1));
    });

    $(".page-prev").on("click", () => {
      this.setPage(Math.max(1, this.currentPage - 1));
    });
  }

  setPage(page) {
    this.currentPage = page;
    this.render();
  }
}

window.onload = () => {
  const app = new CulturePage();
  app.init();
};
