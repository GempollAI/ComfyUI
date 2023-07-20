import { getSysTemplates, getMyTemplates, uploadTemplateJson, addTemplate } from "./web_api.js"
import { $el } from "./ui.js"

class TemplateAddDialog {
	constructor(parent) {
    this.parent = parent
    this.json = null
		this.element = $el("div.template-dialog", { parent: document.body }, [
			$el("div.template-dialog-content", [
        $el('div.template-dialog-input', {}, [
          $el("p", { textContent: '模板名称' }),
          $el("input.tempalte-input", { type: "text"}),
        ]),
				$el("button", {
					type: "button",
					textContent: "取消",
					onclick: () => this.close(),
				}),
        $el("button", {
					type: "button",
					textContent: "确认",
					onclick: () => this.confirm(),
				}),
			]),
		]);
    this.templateInput = document.querySelector('.tempalte-input')
	}

	close() {
		this.element.style.display = "none";
	}

  confirm() {
    if (!this.templateInput.value) {
      alert('请先输入模板名称')
      return
    }
    uploadTemplateJson(this.json).then(res => {
      console.log(res)
      res.code === 200 && addTemplate({
        title: this.templateInput.value,
        content: res.data
      }).then(res2 => {
        if (res2.code === 200) {
          alert('添加模板成功')
          console.log(this.parent)
          this.parent.renderUI()
        }
      })
    })
    this.close()
  }

	show(json) {
    this.json = json // JSON.stringify(json)
    this.templateInput.value = ''
		this.element.style.display = "flex";
	}
}

export class ExtraUI {
  constructor() {
    this.renderUI()
    this.templateSelect = null
    this.templateList = []
    this.dialog = new TemplateAddDialog(this)
  }

  async renderUI() {
    const sysTemplateList = await this.#getSysTemplateList()
    const myTemplateList = await this.#getMyTemplateList()
    this.#renderTemplateSelect([...sysTemplateList, ...myTemplateList])
  }


  async #getSysTemplateList() {
    return getSysTemplates({
      pageNo: 1,
      pageSize: 100
    }).then(res => {
      return Promise.resolve(res.code === 200 ? res.data?.records : [])
    }).catch(err => {
      return Promise.resolve([])
    })
  }

  async #getMyTemplateList() {
    return getMyTemplates({
      pageNo: 1,
      pageSize: 100
    }).then(res => {
      return Promise.resolve(res.code === 200 ? res.data?.records : [])
    }).catch(err => {
      return Promise.resolve([])
    })
  }

  #renderTemplateSelect(res) {
    let children = []
    let defaultIndex = -1
    let extraTemplateList = []
    if (!this.templateSelect) {
      this.templateList = res
      res.forEach(record => {
        children.push(
          $el("option", {
          textContent: record.title
        }))
      })
      // 初次渲染
      this.templateSelect = $el("select.comfy-select", {
        parent: document.getElementsByClassName('comfy-menu')[0],
        onchange: () => {
          const idx = this.templateSelect.options.selectedIndex
          var url = this.templateList[idx].content
          graph.load( url );
        }
      }, children);
      window.templateSelect = this.templateSelect
    } else {
      extraTemplateList = res.filter(x => !this.templateList.some(y => y.id === x.id))
      this.templateList = res
      // 更新内容
      extraTemplateList.forEach(record => {
        this.templateSelect.appendChild($el("option", {
          textContent: record.title
        }))
      })
      defaultIndex = this.templateSelect.options.selectedIndex
    }
    this.resetTemplateSelect(defaultIndex)
  }

  resetTemplateSelect(defaultIndex = -1) {
    this.templateSelect.options.selectedIndex = defaultIndex
  }

  addNewTemplate(json) {
    this.dialog.show(json)
  }

}
