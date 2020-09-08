import * as pathe from 'path'
import { Page } from 'puppeteer'
const { connect_to_database, create_new_table, add_new_single_row_to_table, read_single_row_from_table, update_single_row_to_table } = require('./utils')

let ipdb: any
const database_name = 'test_database'
const table_name = 'test_table'

describe('test the indexedDB database', () => {
    let inner_page: Page
    // set the minimum requirement of the dataabse
    beforeAll(async () => {
        inner_page = await browser.newPage()
        await inner_page.goto('https://www.google.com/', { waitUntil: "domcontentloaded" });
        await add_script_file_to_web(inner_page)
        report_the_browser_log_to_node_log(inner_page)
        await add_utils_script_file_to_web(inner_page)
    })

    afterAll(async () => {
        await jestPuppeteer.resetPage()
        await jestPuppeteer.resetBrowser()
    })

    test('check the availability of the indexedDB', async () => {
        const result = await inner_page.evaluate(function () {
            return ipdb.isIndexDbSupported()
        })

        expect(result).toBeTruthy()
    })

    test('check the connection to indexedDB', async () => {
        const result = await inner_page.evaluate((database_name) => {
            return connect_to_database(database_name)
        }, database_name)

        expect(result).toBeTruthy()
    })

    test('can_create_the_table_into_dataabse', async () => {
        const result = await inner_page.evaluate((database_name, table_name) => {
            return create_new_table(database_name, table_name)
        }, database_name, table_name)

        expect(result).toBe('created')

    }, 12000)

    test('add  new single row in the table', async () => {
        const data_to_insert = { name: 'Prasenjeet Symon', age: 14, gender: 'Male' }
        const result = await inner_page.evaluate((data, database_name, table_name) => {
            return add_new_single_row_to_table(data, database_name, table_name)
        }, data_to_insert, database_name, table_name)

        expect(result).toBeTruthy()
    })

    test('read new row from the table', async () => {
        const result = await inner_page.evaluate((primary_key, database_name, table_name) => {
            return read_single_row_from_table(primary_key, database_name, table_name)
        }, 1, database_name, table_name)

        expect(result).toEqual({ id: 1, name: 'Prasenjeet Symon', age: 14, gender: 'Male' })
    })

    test('update single row to the table', async () => {
        const data_to_update_with = { id: 1, name: 'Prasenjeet Kumar', age: 18, gender: 'Male' }
        const result = await inner_page.evaluate((data, database_name, table_name) => {
            return update_single_row_to_table(data, database_name, table_name)
        }, data_to_update_with,  database_name, table_name)

        expect(result).toBe(1)
    })


})



// helper functions
const add_utils_script_file_to_web = async (page_inner: Page) => {
    await page_inner.addScriptTag({ path: pathe.join(__dirname, './utils.js') });
}

const add_script_file_to_web = async (page_inner: Page) => {
    await page_inner.addScriptTag({ path: pathe.join(__dirname, '../../build/iife/index-min.js') });
}

const report_the_browser_log_to_node_log = (page_inner: Page) => {
    page_inner.on('console', (text) => console.log(text.text(), 'message from the web'))
}
