class WhereClause {
  constructor(base, bigQ) {
    this.base = base;
    this.bigQ = bigQ;
  }

  search() {
    const searchword = this.bigQ.search
      ? {
          name: {
            // here we will putting query to mongo such as product = Product.find(name:{this.bigq.search = coder})
            $regex: this.bigQ.search,
            $options: "i",
          },
        }
      : {};

    this.base = this.base.find({ ...searchword });
    return this;
  }

  pager(redsultperPage) {
    let currentPage = 1;
    if (this.bigQ.page) {
      currentPage = this.bigQ.page;
    }

    let skipval = redsultperPage * (currentPage - 1);

    this.base = this.base.limit(redsultperPage).skip(skipval);
    return this;
  }

  filter() {
    let copyQ = { ...this.bigQ };

    delete copyQ["search"];
    delete copyQ["page"];
    delete copyQ["limit"];

    //   covert the copy into string

    let stringOfCopyQ = JSON.stringify(copyQ);

    stringOfCopyQ = stringOfCopyQ.replace(
      /\b(gte|lte|gt|lt)\b/g,
      (m) => `$${m}`
    );

    const jsonofcopyQ = JSON.parse(stringOfCopyQ);

    this.base = this.base.find(jsonofcopyQ);
    return this
  }
}


module.exports= WhereClause