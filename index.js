/**
 * @name TrueIDPubgMobileByRyucodex
 *
 * @desc Get nickname PUBG Mobile form Midasbuy by entering the pubg mobile player id:
 * `your_url/[playerid]`
 *
 */

const puppeteer = require('puppeteer')
const express = require('express')
const app = express()
const port = 80

app.get('/:id', async (req, res) => {
    (async () => {
        const getPlayerId = await req.params.id
        const browser = await puppeteer.launch({headless:true, args: ['--no-sandbox']})
        const page = await browser.newPage()
        await page.goto('https://www.midasbuy.com/midasbuy/id/buy/pubgm')
        await page.click('.eea-pop .close-btn')
        await page.type('.content .x-main .tab-box .box .n-box .input-box input', getPlayerId)
        await page.click('.content .x-main .tab-box .box .n-box .btn')
        try {
            await page.waitForSelector('.content .x-main .tab-box .box .error-tips', {timeout: 5000})
            let element = await page.$('.content .x-main .tab-box .box .error-tips')
            // let value = await page.evaluate(el => el.textContent, element)
            let response = {
                category:"TrueIDPubgMobileV2",
                author:"RyuCodex",
                playerid:getPlayerId,
                status:"failed",
                details:{
                    description:"Player ID Not Found!",
                }
            }
            const result = JSON.stringify(response, null, 2)
            res.send(`${result}`)
        } catch {
            try {
                await page.waitForSelector('.content .x-main .tab-box .box .new-y-box .user-head .name', {timeout: 5000})
                let element = await page.$('.content .x-main .tab-box .box .new-y-box .user-head .name')
                let value = await page.evaluate(el => el.textContent, element)
                let response = {
                    category:"TrueIDPubgMobileV2",
                    author:"RyuCodex",
                    playerid:getPlayerId,
                    status:"success",
                    details:{
                        description:"Player ID Found!",
                        nickname:value.trim()
                    }
                }
                const result = JSON.stringify(response, null, 2);
                res.send(`${result}`)
            } catch {
                let response = {
                    category:"TrueIDPubgMobileV2",
                    author:"RyuCodex",
                    playerid:getPlayerId,
                    status:"failed",
                    details:{
                        description:"Server Error! Please contact your administrator",
                    }
                }
                const result = JSON.stringify(response, null, 2);
                res.send(`${result}`)
            }
            
        }
        
        await browser.close();
    })();
})

app.listen(port, () => {
    console.log(`Running on port ${port}`)
})
