# Bresleveloper AI SPFx Angular 20 Langchain 1.0.x

For IT or Management: [Read Power Point](TDB/Azure_AI_Solution_SPFx_Dark.pptx)

## Install Angular Dependencies

(or just `npm install` if you dup this repo)

* `npm install @angular/elements --save` (if using with SharePoinbt SPFx)
* `npm install langchain`
* `npm install @langchain/openai`
* `npm install @langchain/classic`


optional `ng g environments`


## Install and set Ollama

* [Download Ollama](https://ollama.com/download)
* Enable CORS to API
    * change `*` to domain for prodcution
    * CMD - `set OLLAMA_ORIGINS=*`
    * PS  - `$env:OLLAMA_ORIGINS="*"` 
* restart service
    * `taskkill /IM ollama.exe /F`
    * `ollama serve`




## Notes about models tested:

* `llama3.2:3b` - used weather not, could not use SPTools
* `qwen3:1.7b`  - used GetSPItems, could not get details from SP site page
* conclusion    - you need a "real" model meaning 20b+




## Important Notes about Langchain

Langchain is a NodeJS platform and uses some dependencies that do not exits on browser. 

The Langchain 1.0.x uses `import { createAgent } from "langchain";` - DO NOT USE THAT.

Generally do not use anything imported from `"langchain"` root folder.

Rules for import in code:

* Model/Chat    =>  `import { ChatOpenAI }  from "@langchain/openai";`
* Tools         =>  `import { tool }        from "@langchain/core/tools";`
* for Agents:
    * `import { AgentExecutor, createToolCallingAgent } from "@langchain/classic/agents";`
    * `import { ChatPromptTemplate }                    from "@langchain/core/prompts";`
* TBD add memory example, but can be also done with simple array for history



### WebLLM

WebLLM is a totally different thing, its basically running local AI model on browser (basically like Ollama browser extension), relevent for tiny models only.
