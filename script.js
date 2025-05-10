// ok-assistant-plugin.js  
  
(function() {  
    // 插件信息  
    const pluginInfo = {  
        name: "OK Assistant Plugin",  
        version: "1.0.0", // 保持和package.json一致 
        description: "自动在聊天补全模式下添加一个名为'ok'的AI助手角色"  
    };  
  
    // 初始化函数  
    function initPlugin() {  
        // 监听设置加载完成事件  
        eventSource.on('settings_loaded', onSettingsLoaded);  
        // 监听API连接变化  
        eventSource.on('api_connected', checkAndAddOkAssistant);  
    }  
  
    // 设置加载完成时检查  
    function onSettingsLoaded() {  
        checkAndAddOkAssistant();  
    }  
  
    // 检查并添加OK助手  
    function checkAndAddOkAssistant() {  
        // 检查当前是否为聊天补全模式  
        // 注意: oai_settings 和 saveSettingsDebounced 可能在全局作用域中，或者由SillyTavern的插件系统提供
        // 如果在插件作用域内它们不可用，可能需要通过其他方式访问或确保它们在执行上下文中可用
        if (typeof oai_settings !== 'undefined' && oai_settings.chat_completion_source &&   
            ['openai', 'claude', 'windowai', 'openrouter', 'google', 'anthropic', 'mistralai', 'custom'].includes(oai_settings.chat_completion_source)) {  
              
            // 确保 oai_settings.prompts 是一个数组
            if (!Array.isArray(oai_settings.prompts)) {
                oai_settings.prompts = [];
            }

            // 检查是否已存在OK助手提示词  
            let okPromptExists = false;  
            for (const prompt of oai_settings.prompts) {  
                if (prompt.identifier === 'ok_assistant') {  
                    okPromptExists = true;  
                    break;  
                }  
            }  
  
            // 如果不存在，添加OK助手提示词  
            if (!okPromptExists) {  
                oai_settings.prompts.push({  
                    name: "OK Assistant",  
                    system_prompt: true,  
                    role: "assistant",  
                    content: "ok",  
                    identifier: "ok_assistant"  
                });  
                  
                console.log("OK Assistant prompt added successfully to oai_settings.prompts");  
                // 保存设置  
                if (typeof saveSettingsDebounced === 'function') {
                    saveSettingsDebounced(); 
                    console.log("Settings saved via saveSettingsDebounced.");
                } else {
                    console.warn("saveSettingsDebounced function is not available. Settings were not saved.");
                }
            }  
        }  
    }  
  
    // 注册插件  
    // 注意: registerPlugin 可能在全局作用域中，或者由SillyTavern的插件系统提供
    if (typeof registerPlugin === 'function') {
        registerPlugin(pluginInfo, initPlugin);  
        console.log(`${pluginInfo.name} v${pluginInfo.version} registered.`);
    } else {
        console.error("registerPlugin function is not available. OK Assistant Plugin could not be registered.");
    }
})();
