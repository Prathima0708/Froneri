package com.froneri.tessmobile;

import android.content.res.AssetManager;
import android.util.Base64;
import android.util.Log;
import android.util.JsonReader;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.*;
import java.util.List;

import org.apache.poi.ss.usermodel.*;
import org.apache.commons.io.IOUtils;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.json.JSONArray;
import org.json.JSONObject;

import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;


public class ExcelEditor extends ReactContextBaseJavaModule {

    ExcelEditor(ReactApplicationContext context) {
        super(context);
    }

    @NonNull
    @Override
    public String getName() {
        return "ExcelEditor";
    }

    public void getJSONData(String excelFilePath, Promise promise) throws IOException {
        InputStream inputStream = null;

        try {
            File file = new File(excelFilePath);
            inputStream = Files.newInputStream(file.toPath());
            WritableArray dataArray = new WritableNativeArray();

            Workbook workbook = WorkbookFactory.create(inputStream);
            Sheet sheet = workbook.getSheetAt(0);

            Row headerRow = sheet.getRow(0);
            List<String> headers = new ArrayList<>();
            for (Cell cell : headerRow) {
                headers.add(cell.getStringCellValue());
            }

            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);

                if (row == null) {
                    continue; // Skip to next row if this one doesn't exist
                }

                WritableMap rowData = Arguments.createMap();

                for (int j = 0; j < headers.size(); j++) {
                    Cell cell = row.getCell(j);

                    if (cell != null) {
                        switch (cell.getCellType()) {
                            case STRING:
                                rowData.putString(headers.get(j), cell.getStringCellValue());
                                break;
                            case NUMERIC:
                                if (DateUtil.isCellDateFormatted(cell)) {
                                    rowData.putString(headers.get(j), cell.getLocalDateTimeCellValue().toString());
                                } else {
                                    rowData.putDouble(headers.get(j), cell.getNumericCellValue());
                                }
                                break;
                            case BOOLEAN:
                                rowData.putBoolean(headers.get(j), cell.getBooleanCellValue());
                                break;
                            case FORMULA:
                                try {
                                    switch (cell.getCachedFormulaResultType()) {
                                        case STRING:
                                            rowData.putString(headers.get(j), cell.getStringCellValue());
                                            break;
                                        case NUMERIC:
                                            if (DateUtil.isCellDateFormatted(cell)) {
                                                rowData.putString(headers.get(j), cell.getLocalDateTimeCellValue().toString());
                                            } else {
                                                rowData.putDouble(headers.get(j), cell.getNumericCellValue());
                                            }
                                            break;
                                        case BOOLEAN:
                                            rowData.putBoolean(headers.get(j), cell.getBooleanCellValue());
                                            break;
                                    }
                                } catch (Exception e) {
                                    Log.d("Formula exception", e.toString());
                                }
                                break;
                            default:
                                // For all other cell types, don't add any value for this cell to rowData
                                break;
                        }
                    }
                }
                dataArray.pushMap(rowData);
            }

            inputStream.close();

            promise.resolve(dataArray);
        } catch (Exception e) {
            Log.d("Exception for file " + excelFilePath, String.valueOf(e));
            if (inputStream != null) {
                try {
                    inputStream.close();
                } catch (IOException error) {
                    Log.d("Exception while closing file" + excelFilePath, String.valueOf(error));
                }
            }

            promise.reject("Error: ", String.valueOf(e));
        }
    }

    public static void readJsonData(String filePath, Callback cb) throws FileNotFoundException {
        StringBuilder stringBuilder = new StringBuilder();

        File file = new File(filePath);
        BufferedReader bufferedReader = new BufferedReader(new FileReader(file));

        try {
            String line;

            while ((line = bufferedReader.readLine()) != null) {
                stringBuilder.append(line);
            }

            JSONObject json = new JSONObject(stringBuilder.toString());
            String collection = json.getString("collection");
            JSONArray data = json.getJSONArray("data");

            WritableMap jsonData = Arguments.createMap();
            WritableArray dataArray = Arguments.createArray();

            jsonData.putString("collection", collection);

            for (int i = 0; i < data.length(); i++) {
                JSONObject item = data.getJSONObject(i);

                WritableMap itemMap = Arguments.createMap();

                Iterator<String> keys = item.keys();
                while (keys.hasNext()) {
                    String key = keys.next();
                    Object value = item.get(key);

                    switch (value.getClass().getSimpleName()) {
                        case "String":
                            itemMap.putString(key, (String) value);
                            break;
                        case "Integer":
                            itemMap.putInt(key, (Integer) value);
                            break;
                        case "Double":
                            itemMap.putDouble(key, (Double) value);
                            break;
                        case "Boolean":
                            itemMap.putBoolean(key, (Boolean) value);
                            break;
                        default:
                            // Handle unknown value types as per your requirement
                            break;
                    }
                }

                dataArray.pushMap(itemMap);
            }

            jsonData.putArray("data", dataArray);

            cb.invoke(jsonData);
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            try {
                bufferedReader.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    @ReactMethod
    public void convertExcelToJson(String excelFilePath, Promise promise) throws Exception{
        try {
            getJSONData(excelFilePath, promise);
        } catch (Exception e) {
            promise.reject("Error: ", e);
        }
    }

    @ReactMethod
    public void readJsonFile(String jsonFileName, Callback cb) throws Exception{
        try {
            readJsonData(jsonFileName, cb);

        } catch (Exception e) {
            cb.invoke("Error: " + e, true);
        }
    }
}
