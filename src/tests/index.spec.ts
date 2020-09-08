import * as pathe from 'path'
const {connect_to_database, create_new_table} = require('./utils')
let ipdb: any

beforeAll(async () => {
    await page.goto('https://www.google.com/', { waitUntil: "domcontentloaded" });
    await add_script_file_to_web()
    report_the_browser_log_to_node_log()
    await add_utils_script_file_to_web()
});

describe('test the indexedDB database', () => {

    test('check the availability of the indexedDB', async () => {
        const result = await page.evaluate(function () {
            return ipdb.isIndexDbSupported()
        })

        expect(result).toBeTruthy()
    })

    test('check the connection to indexedDB', async () => {
        const result = await page.evaluate((database_name) => {
            return connect_to_database(database_name)
        }, 'test_database')

        expect(result).toBeTruthy()
    })

    test('can_create_the_table_into_dataabse', async () => {
        const result = await page.evaluate((database_name, table_name) => {
            return create_new_table(database_name, table_name)
        }, 'test_database', 'test_table')

        expect(result).toBe('created')
    }, 12000)
})

// helper functions

const add_utils_script_file_to_web = async () => {
    await page.addScriptTag({ path: pathe.join(__dirname, './utils.js') });
}

const add_script_file_to_web = async () => {
    await page.addScriptTag({ path: pathe.join(__dirname, '../../build/iife/index-min.js') });
}

const report_the_browser_log_to_node_log = () => {
    page.on('console', (text) => console.log(text.text(), 'message from the web'))
}
