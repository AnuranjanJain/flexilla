import { AccordionOptions, AccordionParams } from "./types";
import { activeAlwaysOpen, activateDefaultAccordionItem, closeOtherAccordionItems, initItems, expandAccordionItem } from "./helpers";
import { findAll, findDirectDescendant } from "@flexilla/utilities";

/**
* Accordion Component
*/
class Accordion {
    private accordionElement: HTMLElement
    private options: AccordionOptions
    private items: HTMLElement[]
    private preventFromClosingAll: boolean
    private allowTriggerOnFocus: boolean
    private accordionType: string
    private defaultItemValue: string
    private defaultItem: HTMLElement | null | undefined
    public instance: Accordion

    /**
     * Creates an accordion with the specified parameters.
     */
    constructor({ accordionElement, options = {} }: AccordionParams) {
        this.instance = this
        if (!(accordionElement instanceof HTMLElement))
            throw new Error("Container not a valid HTML elemnt")
        this.accordionElement = accordionElement
        const items_ = findAll({ selector: "[data-accordion-item]", parentElement: accordionElement })
        
        // Filter out only the direct descendants
        this.items = items_.filter((item) => item.parentElement === this.accordionElement);

        if (this.items.length <= 0) throw new Error("No item find")
        this.options = options

        const { defaultValue, accordionType, preventClosingAll = false, allowTriggerOnFocus = false } = this.options
        this.preventFromClosingAll = preventClosingAll || (this.accordionElement.hasAttribute("data-prevent-closing-all") && this.accordionElement.getAttribute("data-prevent-closing-all") !== "false") || false
        this.allowTriggerOnFocus = allowTriggerOnFocus || this.accordionElement.hasAttribute("data-allow-trigger-on-focus") && this.accordionElement.getAttribute("data-allow-trigger-on-focus") !== "false" || false
        this.accordionType = accordionType || this.accordionElement.dataset.accordionType || "single"
        this.defaultItemValue = defaultValue || this.accordionElement.dataset.defaultValue || ""
        this.defaultItem = findDirectDescendant({
            selector: `[data-accordion-item][data-accordion-value="${this.defaultItemValue}"]`,
            parentElement: accordionElement
        })
        this.init()
    }
    showItem = ({ itemSelector }: { itemSelector: string }) => {
        const accordionItem = findDirectDescendant({
            selector: `${itemSelector}`,
            parentElement: this.accordionElement
        })
        if (!(accordionItem instanceof HTMLElement)) throw new Error("Providied element is not a valid HTML element")
        expandAccordionItem(accordionItem, "open")
    }
    hideItem = ({ itemSelector }: { itemSelector: string }) => {
        const accordionItem = findDirectDescendant({
            selector: `${itemSelector}`,
            parentElement: this.accordionElement
        })
        if (!(accordionItem instanceof HTMLElement)) throw new Error("Providied element is not a valid HTML element")
        expandAccordionItem(accordionItem, "close")
    }

    private init() {
        activeAlwaysOpen(this.accordionElement)
        if (this.defaultItem instanceof HTMLElement) activateDefaultAccordionItem(this.defaultItem)
        closeOtherAccordionItems(this.accordionElement, this.defaultItemValue)
        initItems(this.accordionElement, this.accordionType, this.preventFromClosingAll, this.allowTriggerOnFocus, this.options)
    }
}

export default Accordion