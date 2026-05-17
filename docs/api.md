* API login
POST https://www.evnhcmc.vn/Dangnhap/checkLG
request: u=0962221222&p=password&remember=1&token=
response: 
- Login success
```json
{
  "state": "success",
  "alert": "\u0110\u0103ng nh\u1eadp th\u00e0nh c\u00f4ng !",
  "data": []
}
```

* API lay dien nang tieu thu theo ngay
POST https://www.evnhcmc.vn/Tracuu/ajax_dienNangTieuThuTheoNgay
request: token=&input_makh=PE20000003396&input_tungay=03%2F05%2F2026&input_denngay=18%2F05%2F2026
response:
```json
{
  "state": "success",
  "alert": "S\u1ea3n l\u01b0\u1ee3ng \u0111i\u1ec7n s\u1eed d\u1ee5ng",
  "data": {
    "soNgay": 16,
    "tieude": "T\u1eeb 03\/05\/2026 \u0111\u1ebfn 18\/05\/2026",
    "sanluong_tungngay": [
      {
        "ngay": "03\/05",
        "ngayFull": "03\/05\/2026",
        "TD": 0,
        "BT": 0,
        "CD": 0,
        "Tong": 0,
        "sanluong_TD": "0.00",
        "sanluong_BT": "0.00",
        "sanluong_CD": "0.00",
        "sanluong_tong": "!",
        "hsn": 1,
        "p_giao_bt": "0.00",
        "p_giao_td": "0.00",
        "p_giao_cd": "0.00",
        "tong_p_giao": "0.00",
        "tong_q_giao": "0.00",
        "thoidiemdo": "03\/05\/2026",
        "isChotHoaDon": 0
      }
    ],
    "sanluong_tong": {
      "TD": 0,
      "BT": 58.36,
      "CD": 0,
      "Tong": 58.36,
      "TD_format": "0.00",
      "BT_format": "58.36",
      "CD_format": "0.00",
      "Tong_format": "58.36"
    }
  }
}
```

* API lay dien nang tieu thu theo ky hoa don
POST https://www.evnhcmc.vn/Tracuu/ajax_dienNangTieuThuTheoKyHoaDon
request: token=&input_makh=PE20000003396
response: 
```json
{
  "state": "success",
  "alert": "",
  "data": {
    "tieude": "S\u1ea3n l\u01b0\u1ee3ng \u0111i\u1ec7n s\u1eed d\u1ee5ng",
    "sanluong_hoadon": [
      {
        "KY": "1",
        "THANG": "11",
        "NAM": "2025",
        "NAME": "11\/2025",
        "NAME_FULL": "11\/2025",
        "SAN_LUONG": "81.00",
        "SO_TIEN": "162750.00",
        "TIEN_THUE": "13020.00",
        "TONG_TIEN": "175770.00",
        "NGAY_DKY": "01\/11\/2025",
        "NGAY_CKY": "30\/11\/2025",
        "TRANG_THAI": 0,
        "CHISO": []
      },
      {
        "KY": "1",
        "THANG": "12",
        "NAM": "2025",
        "NAME": "12\/2025",
        "NAME_FULL": "12\/2025",
        "SAN_LUONG": "165.00",
        "SO_TIEN": "356400.00",
        "TIEN_THUE": "28512.00",
        "TONG_TIEN": "384912.00",
        "NGAY_DKY": "01\/12\/2025",
        "NGAY_CKY": "31\/12\/2025",
        "TRANG_THAI": 0,
        "CHISO": []
      }
    ],
    "tong": {
      "SAN_LUONG": 1300,
      "SO_TIEN": 3097250,
      "TIEN_THUE": 247780,
      "TONG_TIEN": 3345030,
      "SAN_LUONG_FORMAT": "1,300"
    }
  }
}
```

* API kiem tra no
POST https://www.evnhcmc.vn/Tracuu/kiemTraNo
request: input_makh=PE20000003396
response: 
```json
{
  "state": "success",
  "alert": "Ki\u1ec3m tra n\u1ee3 th\u00e0nh c\u00f4ng",
  "data": {
    "isNo": 0,
    "info_no": []
  }
}
```
* API calculate
POST https://calc.evn.com.vn/TinhHoaDon/api/Calculate
Request:
```json
{
  "KIMUA_CSPK": "0",
  "LOAI_DDO": "1",
  "SO_HO": 1,
  "MA_CAPDAP": "1",
  "NGAY_DKY": "01/05/2026",
  "NGAY_CKY": "31/05/2026",
  "NGAY_DGIA": "31/05/2026",
  "HDG_BBAN_APGIA": [
    {
      "LOAI_BCS": "KT",
      "TGIAN_BANDIEN": "KT",
      "MA_NHOMNN": "SHBT",
      "MA_NGIA": "A"
    }
  ],
  "GCS_CHISO": [
    {
      "BCS": "KT",
      "SAN_LUONG": "120",
      "LOAI_CHISO": "DDK"
    }
  ]
}
```
Response:
```json
{
  "Data": {
    "HDN_HDON": [
      {
        "TONG_TIEN": 356400
      }
    ]
  }
}
```

----
Design: https://gemini.google.com/share/4df2b5c4d94a
